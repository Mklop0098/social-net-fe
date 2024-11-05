import ReactDOM from 'react-dom/client';
import App from './App.tsx'
import './index.css'
import { MsgContextProvider } from './components/Context/msgContext.tsx'
import { UserContextProvider } from './components/Context/userContext.tsx'
import { NotifyContextProvider } from './components/Context/notifyContext.tsx'
import { FriendContextProvider } from './components/Context/friendContext.tsx'
import { SocketIoContextProvider } from './components/Context/socketIOContext.tsx'
import { ModalContextProvider } from './components/Context/modalContext.tsx'
import { PostContextProvider } from './components/Context/postContext.tsx'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <SocketIoContextProvider>
    <UserContextProvider>
      <MsgContextProvider>
        <NotifyContextProvider>
          <PostContextProvider>
            <FriendContextProvider>
              <ModalContextProvider>
                <App />
              </ModalContextProvider>
            </FriendContextProvider>
          </PostContextProvider>
        </NotifyContextProvider>
      </MsgContextProvider>
    </UserContextProvider>
  </SocketIoContextProvider>
)
