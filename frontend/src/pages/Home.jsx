import { useState } from "react";

import CreateGroup from "../components/CreateGroup";
import EnterGroup from "../components/EnterGroup";

function Home() {
    const [activeForm, setActiveForm] = useState(null);

    return (
        <div className="app">

            <h1>Group Chat</h1>

            <p>
                Private real-time group chat
            </p>

            <div className="buttons">

                <button
                    onClick={() =>
                        setActiveForm("create")
                    }
                >
                    Create Group
                </button>

                <button
                    onClick={() =>
                        setActiveForm("join")
                    }
                >
                    Enter Group
                </button>

            </div>


            {activeForm === "create" && (
                <CreateGroup />
            )}


            {activeForm === "join" && (
                <EnterGroup />
            )}

        </div>
    );
}

export default Home;