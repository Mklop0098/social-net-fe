import HomeFriendsPage from "../pages/user/HomeFriendsPage";
import Homepage from "../pages/user/Homepage";
import Login from "../pages/user/Login";
import Register from "../pages/user/Register";
import UserFriendsPage from "../pages/user/UserFriendsPage";
import UserArticlePage from "../pages/user/UserrAticlePage";
import DefautLayout from "./Layouts/DefautLayout";
import  UserPageLayout from "./Layouts/UserPageLayout";
import {FriendRequestLayout} from './Layouts/FriendRequestLayout'
import SearchFriend from "../pages/friendPage/SearchFriend";
import { FriendPageLayout } from "./Layouts/FriendPageLayout";
import FriendPage from '../pages/friendPage/FriendPage'
import FriendPageEmpty from '../pages/friendPage/FriendPageEmpty'
import FriendDetailPage from "../pages/friendPage/Profile";
import SearchPage from '../pages/search/SearchPage'
import SearchLayout from "./Layouts/SearchLayout";

export const publicRoutes = [
    { path: '/', component: Homepage, layout: DefautLayout },
    { path: '/friends', component: HomeFriendsPage, layout: DefautLayout },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    { path: '/:id/:status', component: UserFriendsPage, layout: UserPageLayout },
    { path: '/:id', component: UserArticlePage, layout: UserPageLayout },
    { path: '/profile/:id', component: FriendDetailPage, layout: DefautLayout },
    { path: '/friends/requests', component: SearchFriend, layout: FriendRequestLayout },
    { path: '/friends/list', component: FriendPageEmpty, layout: FriendPageLayout },
    { path: '/friends/list/:id', component: FriendPage, layout: FriendPageLayout },
    { path: '/search/:value', component: SearchPage, layout: SearchLayout },
];

export const privateRoutes = [];
