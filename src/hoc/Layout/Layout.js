import React, { useState } from 'react';
import { connect } from 'react-redux'

import Aux from '../Auxx/Auxx';
import classes from './Layout.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

const layout = props => {
    const [sideDrawerVisible, setSideDrawerVisible] = useState(false);

    const sideDrawerClosedHandler = () => {
        setSideDrawerVisible(false)
    }

    const sideDrawerToggleHandler = () => {
        setSideDrawerVisible(!sideDrawerVisible);
    }

    return (
        <Aux>
            <Toolbar
                isAuth={props.isAuth}
                drawerToggleClicked={sideDrawerToggleHandler} />
            <SideDrawer
                isAuth={props.isAuth}
                open={sideDrawerVisible}
                closed={sideDrawerClosedHandler} />
            <main className={classes.Content}>
                {props.children}
            </main>
        </Aux>
    )

}

const mapStateToProps = state => {
    return {
        isAuth: state.auth.token !== null
    }
}
export default connect(mapStateToProps)(layout);