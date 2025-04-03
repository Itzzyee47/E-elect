import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import '../styles/LandingPage.css';

const LandingPage = () => {
    return (
        <div className="landing-page">
            <Header />
            <main className="main-content">
                <div className="home">
                    <h2>Empower Your Voice with Secure E-Voting</h2>
                    <p className="slogan">Our e-voting platform simplifies the election process for organizations and users alike. <br />
                    Experience seamless election management and transparent voting, ensuring every voice is heard.
                    </p>
                    <Link to="/login"><button className="get-started-button">Get Started</button></Link>
                </div>
                <div id='about' className="about-1">
                    <div className="a1_text">
                        <min>Empower</min>
                        <h2 className="abt">Revolutionize Your Voting Experience Today</h2>
                        Our platform ensure secure and transparent voting, giving you peace of mind. Experience real-time 
                        results and a user-friendly interface that makes participation effortless.
                    </div>
                    <div className="a1_img"></div>
                </div>
                <div className="about-2">
                    <div className='a2Header'>
                    <min>Empower</min>
                    <h2>Unlock the Future of Voting Today</h2>
                    </div>
                    <div className="actions">
                        <div className="action">
                            <h3>Comprehensive Organisational Dashboard for Administrators</h3>
                            <p>
                                Easily create and manage elections with our intuitive dashboard.
                            </p>
                        </div>
                        <div className="action">
                            <h3>Simple and Secure User Voting Experience</h3>
                            <p>
                               Cast your vote effortlessly with just a few clicks.
                            </p>
                        </div>
                        <div className="action">
                            <h3>Efficient Election Management for All Types</h3>
                            <p>
                                Manage candidates and positions with ease and presision.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default LandingPage;