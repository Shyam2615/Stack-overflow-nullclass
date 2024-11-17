import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import moment from "moment";
import LeftSidebar from "../../components/LeftSideBar/LeftSideBar";
import EditProfileForm from "./EditProfileForm";
import ProfileBio from "./ProfileBio";
import Avatar from "../../components/Avatar/Avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBirthdayCake, faPen } from "@fortawesome/free-solid-svg-icons";
import "./UserProfile.css";
import axios from "axios";

const UserProfile = () => {
    const { id } = useParams();
    const users = useSelector((state) => state.usersReducer);
    const currentProfile = users.filter((user) => user._id === id)[0];
    const currentUser = useSelector((state) => state.currentUserReducer);
    const [Switch, setSwitch] = useState(false);

    // Location and weather state
    const [location, setLocation] = useState(null);
    const [weather, setWeather] = useState(null);

    // Handle fetching location and weather
    const handleLocationFetch = async () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;

                try {
                    // Fetch location data using OpenStreetMap's Nominatim API
                    const locationResponse = await axios.get(
                        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
                    );
                    const locationData = locationResponse.data;
                    const locationString = `${locationData.address.city || locationData.address.town || "Unknown City"}, ${
                        locationData.address.state || "Unknown State"
                    }, ${locationData.address.country || "Unknown Country"}`;
                    setLocation(locationString);

                    // Fetch weather data using OpenWeatherMap
                    const weatherResponse = await axios.get(
                        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=dac58a072d780768096945be1de4b968`
                    );
                    const weatherData = weatherResponse.data;
                    setWeather({
                        temp: (weatherData.main.temp - 273.15).toFixed(1), // convert Kelvin to Celsius
                        description: weatherData.weather[0].description,
                    });
                } catch (error) {
                    console.error("Error fetching location or weather data:", error);
                    setLocation("Error fetching location.");
                }
            });
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    return (
        <div className="home-container-1">
            <LeftSidebar />
            <div className="home-container-2">
                <section>
                    <div className="user-details-container">
                        <div className="user-details">
                            <Avatar backgroundColor="purple" color="white" fontSize="50px" px="40px" py="30px">
                                {currentProfile?.name.charAt(0).toUpperCase()}
                            </Avatar>
                            <div className="user-name">
                                <h1>{currentProfile?.name}</h1>
                                <p><FontAwesomeIcon icon={faBirthdayCake} /> Joined {moment(currentProfile?.joinedOn).fromNow()}</p>
                            </div>
                        </div>
                        {currentUser?.result?._id === id && (
                            <button onClick={() => setSwitch(true)} className="edit-profile-btn">
                                <FontAwesomeIcon icon={faPen} /> Edit Profile
                            </button>
                        )}
                    </div>
                    <div>
                        {Switch ? (
                            <EditProfileForm currentUser={currentUser} setSwitch={setSwitch} />
                        ) : (
                            <ProfileBio currentProfile={currentProfile} />
                        )}
                    </div>

                    {/* Obtain Location Button and Display */}
                    <div style={{ marginTop: "20px" }}>
                        <button onClick={handleLocationFetch}>Obtain Location</button>
                        {location && (
                            <div>
                                <h3>Location: {location}</h3>
                                {weather && (
                                    <p>Weather: {weather.temp}°C, {weather.description}</p>
                                )}
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default UserProfile;
