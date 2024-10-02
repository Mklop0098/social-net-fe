import HomeFriendsPage from "../pages/user/HomeFriendsPage";
import Homepage from "../pages/user/Homepage";
import Login from "../pages/user/Login";
import Register from "../pages/user/Register";
import UserFriendsPage from "../pages/user/UserFriendsPage";
import UserArticlePage from "../pages/user/UserrAticlePage";
import DefautLayout from "./Layouts/DefautLayout";
import  UserPageLayout from "./Layouts/UserPageLayout";

export const publicRoutes = [
    { path: '/', component: Homepage, layout: DefautLayout },
    { path: '/friends', component: HomeFriendsPage, layout: DefautLayout },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    { path: '/:id/:status', component: UserFriendsPage, layout: UserPageLayout },
    { path: '/:id', component: UserArticlePage, layout: UserPageLayout },
];

export const privateRoutes = [];