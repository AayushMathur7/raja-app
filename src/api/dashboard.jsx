export const initializeRepo = async (repoLink) => {
    try {
        const response = await fetch('http://localhost:5000/v1/initialize-repo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ repo_url: repoLink })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // If response contains any data that you want to return, parse and return it here
        // return await response.json();
    } catch (error) {
        console.error("Failed to initialize repo:", error);
    }
}

export const rajaAgent = async (details) => {
    try {
        const response = await fetch('http://localhost:5000/v1/run-raja', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ details: details })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

    } catch (error) {
        console.error("Failed to run raja agent:", error);
    }
}
