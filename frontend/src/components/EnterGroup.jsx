import { useState } from "react";
import { useNavigate } from "react-router-dom";

function EnterGroup() {

    const navigate = useNavigate();

    const [nickname, setNickname] = useState("");
    const [groupCode, setGroupCode] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    const joinGroup = async (e) => {
        e.preventDefault();

        setError("");

        if (!groupCode || !password) {
            setError(
                "Group code and password are required"
            );
            return;
        }

        try {

            setLoading(true);

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/groups/join`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        nickname: nickname,
                        groupCode: groupCode,
                        password: password
                    })
                }
            );


            const data = await response.json();


            if (!response.ok) {

                setError(
                    data.message ||
                    "Failed to join group"
                );

                return;
            }


            // Save group information temporarily
            sessionStorage.setItem(
                "chatGroup",
                JSON.stringify({
                    groupId: data.group.id,
                    groupName: data.group.name,
                    groupCode: data.group.groupCode,
                    nickname: data.nickname
                })
            );


            // Go to Chat page
            navigate("/chat");


        } catch (error) {

            console.log(
                "Join Group Error:",
                error
            );

            setError(
                "Server se connect nahi ho pa raha"
            );

        } finally {

            setLoading(false);

        }
    };


    return (
        <form
            className="form-box"
            onSubmit={joinGroup}
        >

            <h2>Enter Group</h2>


            <input
                type="text"
                placeholder="Nickname (optional)"
                value={nickname}
                onChange={(e) =>
                    setNickname(e.target.value)
                }
            />


            <input
                type="text"
                placeholder="Group Code"
                value={groupCode}
                onChange={(e) =>
                    setGroupCode(
                        e.target.value.toUpperCase()
                    )
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
                {loading
                    ? "Entering..."
                    : "Enter Group"
                }
            </button>


            {error && (
                <p className="error">
                    {error}
                </p>
            )}

        </form>
    );
}

export default EnterGroup;