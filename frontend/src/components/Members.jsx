
function Members({ members }) {

    return (
        <div className="members">

            <h3>
                Members ({members.length})
            </h3>


            {members.length === 0 ? (

                <p>
                    No members
                </p>

            ) : (

                members.map((member, index) => (

                    <div
                        className="member"
                        key={`${member.nickname}-${index}`}
                    >

                        <span className="online-dot"></span>

                        <span>
                            {member.nickname}
                        </span>

                    </div>

                ))

            )}

        </div>
    );

}

export default Members;

