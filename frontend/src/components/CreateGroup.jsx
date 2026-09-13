import { useState } from "react";

function CreateGroup() {
    const [groupName, setGroupName] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [groupCode, setGroupCode] = useState("");

    const createGroup = async (e) => {
        e.preventDefault();

        setError("");
        setGroupCode("");

        if (!groupName || !password) {
            setError("Group name and password are required");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/groups/create`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name: groupName,
                        password: password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.message);
                return;
            }

            setGroupCode(data.groupCode);

            setGroupName("");
            setPassword("");

        } catch (error) {
            console.log(error);
            setError("Server se connect nahi ho pa raha");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            className="form-box"
            onSubmit={createGroup}
        >
            <h2>Create Group</h2>

            <input
                type="text"
                placeholder="Group Name"
                value={groupName}
                onChange={(e) =>
                    setGroupName(e.target.value)
                }
            />

            <input
                type="password"
                placeholder="Group Password"
                value={password}
                onChange={(e) =>
                    setPassword(e.target.value)
                }
            />

            <button
                type="submit"
                disabled={loading}
            >
                {loading ? "Creating..." : "Create Group"}
            </button>

            {error && (
                <p className="error">
                    {error}
                </p>
            )}

            {groupCode && (
                <div className="success-box">
                    <h3>Group Created 🎉</h3>

                    <p>Your Group Code:</p>

                    <strong>
                        {groupCode}
                    </strong>

                    <p>
                        Is code ko save kar lena.
                    </p>
                </div>
            )}
        </form>
    );
}

export default CreateGroup;