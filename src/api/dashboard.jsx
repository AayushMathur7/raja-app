export const createUser = async (userData) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_SERVER_URL}/v1/create-user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

    } catch (error) {
        console.error("Failed to create ticket:", error);
    }
}

//Add variable to track if the current repo has been used before (Differentiate between initialize and load)
export const initializeRepo = async (userEmailId, userEmail, repoLink, presentInRepos) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_SERVER_URL}/v1/initialize-repo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_id: userEmailId, user_email: userEmail, repo_url: repoLink , loadedPreviously: presentInRepos})
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
    const { type, name, label, description, acceptance_criteria, how_to_reproduce } = details;

    const filteredDetails = {
        type,
        name,
        label,
        description,
        acceptance_criteria,
        how_to_reproduce
    };

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_SERVER_URL}/v1/run-raja`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(filteredDetails)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.task_id;

    } catch (error) {
        console.error("Failed to run raja agent:", error);
    }
}

export const checkRajaTaskStatus = async (taskId) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_SERVER_URL}/v1/tasks/${taskId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Failed to check task status:", error);
    }
}

export const getTickets = async (userId) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_SERVER_URL}/v1/get-tickets/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Failed to fetch tickets:", error);
    }
}

//Get repos for a person
export const getRepos = async (userId) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_SERVER_URL}/v1/get-repos/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Failed to fetch:", error);
    }
}

export const createTicket = async (ticketData) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_SERVER_URL}/v1/create-ticket`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ticketData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

    } catch (error) {
        console.error("Failed to create ticket:", error);
    }
}
