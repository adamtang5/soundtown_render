import React, { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import { clearPlayer } from '../store/player';
import { logout } from '../store/session';
import { NavLink } from "react-router-dom";



function UserProfile({ user }) {

    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);

    const openMenu = () => {
        if (showMenu) return;
        setShowMenu(true);
    };

    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = () => {
            setShowMenu(false);
        };

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener("click", closeMenu);
    }, [showMenu]);

    const onLogout = () => {
        dispatch(clearPlayer());
        dispatch(logout());
    };

    return (
        <>
            <div>
                <button className="userProfileBtn" onClick={openMenu} > {user.email} </button>
                <div className="dropdown">
                    {showMenu && (
                        <div className="profile-dropdown">
                            <div>
                                <NavLink className='navlinks ' to={`/users/${user.id}`} exact={true} activeClassName="active"> Profile </NavLink>
                                <div style={{ width: '100%', borderBottom: 'whitesmoke solid 1px', paddingTop: '7px' }}> </div>
                            </div>
                            <button style={{ minWidth: '80px' }} onClick={onLogout}>Log Out</button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default UserProfile;
