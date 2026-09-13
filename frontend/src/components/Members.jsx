function Members({ nickname }) {
    return (
        <div className="members">

            <h3>Members</h3>

            <div className="member">
                <span className="online-dot"></span>

                <span>
                    {nickname}
                </span>
            </div>

        </div>
    );
}

export default Members;