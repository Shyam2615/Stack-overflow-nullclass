import React, { useEffect, useState } from 'react';
import { GiPoliceBadge } from "react-icons/gi";
import axios from "axios";
import { useSelector } from "react-redux";

const ProfileBio = ({ currentProfile }) => {
    const profileData = JSON.parse(localStorage.getItem("Profile"));
    const token = profileData?.token;
    const userId = profileData?.result?._id;
    const User = useSelector((state) => state.currentUserReducer);

    const [badge, setBadge] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [points, setPoints] = useState(0);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // Fetch badges
    const fetchBadges = async () => {
        if (!currentProfile?._id) return;
        try {
            const response = await axios.get(`http://localhost:5000/answers/getbadges/${currentProfile._id}`);
            setBadge(response.data.badge);
        } catch (error) {
            console.error("Error fetching badges", error);
        }
    };

    useEffect(() => {
        fetchBadges();
    }, [currentProfile]);

    // Handle user search
    const handleSearch = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/user/search?query=${searchQuery}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSearchResults(response.data);
        } catch (error) {
            console.error("Error searching users", error);
        }
    };

    // Handle points transfer
    const handleTransfer = async (toUserId) => {
        if (points < 1) {
            setError("Please enter a valid number of points.");
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:5000/answers/transfer",
                { toUserId, points },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Update the badge count immediately
            setBadge((prevBadge) => prevBadge - points);

            // Refetch the badge count to confirm
            await fetchBadges();

            setSuccessMessage(response.data.message || "Points transferred successfully!");
            setError("");
            setPoints(0);
        } catch (error) {
            console.error(error);
            setError(error.response?.data || "Error transferring points.");
            setSuccessMessage("");
        }
    };

    return (
        <div>
            <div>
                {currentProfile?.tags.length !== 0 ? (
                    <>
                        <h4>{currentProfile?.tags.length} Tags Watched</h4>
                        {currentProfile?.tags.map((tag) => (
                            <p style={{ fontWeight: "400" }} key={tag}>
                                {tag}
                            </p>
                        ))}
                    </>
                ) : (
                    <p style={{ fontSize: "14px", fontWeight: "500" }}>0 Tags Watched</p>
                )}
            </div>

            <div>
                {currentProfile?.about ? (
                    <>
                        <h4>About</h4>
                        <p>{currentProfile?.about}</p>
                    </>
                ) : (
                    <p>No Bio Found :(</p>
                )}

                <div className="badge-desc">
                    <b style={{ fontSize: "30px" }}>Badges</b>
                </div>
                <div className="badge d-flex" style={{ color: "black", fontSize: "100px" }}>
                    <GiPoliceBadge className="mt-2" style={{ color: "Red" }} /> <div>{badge}</div>
                </div>
            </div>

            <div className="transfer-section">
                <h3>Transfer Points</h3>
                <div>
                    <input
                        type="text"
                        placeholder="Search user by name"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button onClick={handleSearch}>Search</button>
                </div>

                {searchResults.map((user) => (
                    <div key={user._id} className="user-item">
                        <p>{user.name}</p>
                        <input
                            type="number"
                            placeholder="Enter points"
                            value={points}
                            onChange={(e) => setPoints(Number(e.target.value))}
                        />
                        <button onClick={() => handleTransfer(user._id)}>Transfer</button>
                    </div>
                ))}

                {error && <p style={{ color: "red" }}>{error}</p>}
                {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
            </div>
        </div>
    );
};

export default ProfileBio;
