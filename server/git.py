def create_github_pull_request(ghapi, ghapi_raja, code_change, metadata):
    # Step 1: Create a new branch
    # Get SHA of the latest commit on base branch
    base_ref = ghapi.git.get_ref(ref=f"heads/main")
    base_sha = base_ref.object.sha

    # The name of the new branch to be created
    new_branch_name = metadata["branch_name"]
    # new_branch_name = "master"

    # Create a new branch based on base branch
    try:
        ghapi.git.create_ref(ref=f"refs/heads/{new_branch_name}", sha=base_sha)
        print(f"Branch {new_branch_name} created.")
    except Exception as e:
        if "Reference already exists" in str(e):
            print(f"Branch {new_branch_name} already exists. Continuing...")
        else:
            raise

    # Step 2: Create the commit
    # Create a new tree based on changes
    tree_items, old_tree_sha = create_tree_items(ghapi, code_change)

    # Create a new tree with the tree_items and get the sha of the tree
    new_tree = ghapi.git.create_tree(
        accept="application/vnd.github+json", tree=tree_items, base_tree=old_tree_sha
    )
    new_tree_sha = new_tree.sha
    print("New tree sha:", new_tree_sha)

    # Get the reference
    new_branch = ghapi.git.get_ref(ref=f"heads/{new_branch_name}")
    print(f"New branch {new_branch_name} state: {new_branch.object.sha}")

    # Get SHA of the latest commit on base branch again
    base_ref = ghapi.git.get_ref(ref=f"heads/main")
    base_sha = base_ref.object.sha
    print("Base ref object: ", base_ref.object)
    print("Base sha: ", base_sha)

    # Create a new commit that points to this tree and parents are the latest commit on base branch
    new_commit = ghapi_raja.git.create_commit(
        message="Fix bug", tree=new_tree_sha, parents=[base_sha]
    )
    print("New commit sha: ", new_commit.sha)

    # Get the reference
    new_branch = ghapi.git.get_ref(ref=f"heads/{new_branch_name}")
    print(
        f"New branch {new_branch_name} state after new commit: {new_branch.object.sha}"
    )

    # Update the reference of the new branch to point to the new commit
    ghapi.git.update_ref(ref=f"heads/{new_branch_name}", sha=new_commit.sha, force=True)
    new_branch = ghapi.git.get_ref(ref=f"heads/{new_branch_name}")
    print(
        f"New branch {new_branch_name} state after updating ref: {new_branch.object.sha}"
    )

    # Step 3: Create the pull request
    pr_title = metadata["pr_title"]
    pr_body = metadata["pr_body"]
    pr_response = ghapi_raja.pulls.create(
        head=new_branch_name, base="main", title=pr_title, body=pr_body
    )

    pr_url = pr_response.html_url
    print(f"Pull request created at: {pr_url}")

    return pr_url


def create_tree_items(ghapi, files):
    def _get_tree_items():
        # Get SHA of the latest commit on the base branch
        base_ref = ghapi.git.get_ref(ref=f"heads/main")
        base_sha = base_ref.object.sha

        # Get the tree SHA of the latest commit
        commit = ghapi.repos.get_commit(ref=base_sha)
        old_tree_sha = commit.commit.tree.sha

        # Fetch the tree items
        tree = ghapi.git.get_tree(tree_sha=old_tree_sha, recursive=True)

        print("Old tree sha: ", tree.sha)

        # Create a list of dictionaries containing only the necessary fields
        tree_items = [
            {
                "path": item.path,
                "mode": item.mode,
                "type": item.type,
                "sha": item.sha,
            }
            for item in tree.tree
        ]

        return tree_items, old_tree_sha

    tree_items, old_tree_sha = _get_tree_items()

    new_tree_items = []

    for file_path, file_content in files.items():
        # Create a blob for the file content
        blob_sha = ghapi.git.create_blob(content=file_content, encoding="utf-8")
        blob_sha_str = blob_sha["sha"]  # Extract the sha as a string

        # Construct a tree item for the blob
        new_tree_item = {
            "path": file_path,
            "mode": "100644",  # standard file mode
            "type": "blob",
            "sha": blob_sha_str,  # Use the string SHA
        }
        print(f"New blob created for {file_path}: ", new_tree_item["sha"])

        # check whether file_path is in tree_items
        if file_path in [item["path"] for item in tree_items]:
            existing_blob = [item for item in tree_items if item["path"] == file_path][
                0
            ]["sha"]
            print(f"Replacing existing blob at {file_path}: ", existing_blob)
        else:
            print(f"Inserting new blob at {file_path}")

        new_tree_items.append(new_tree_item)

    return new_tree_items, old_tree_sha
