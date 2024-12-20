
import ReactDOM from 'react-dom';
import { useModal } from '../components/Context/modalContext';
import { ReactNode, useRef } from 'react';
import { useMsg } from '../components/Context/msgContext'

type ModalProps = {
    root: string,
    toggle: boolean,
    onClick?: <T>(args?: T) => void
    body?: ReactNode,
    width: number,
    height: number,
}

export const Modal: React.FC<ModalProps> = (props) => {
    // const { onClick } = props;
    const { root, toggle, body, width = 50, height = 50, onClick = () => { } } = props;
    console.log(width, height)
    const { hideModal } = useModal();
    const { setIsReply } = useMsg()

    const ref = useRef<HTMLDivElement>(null);


    if (toggle && root) {
        const el: HTMLElement = document.getElementById(root) as HTMLElement;
        return ReactDOM.createPortal(
            <div className='w-full h-full top-0 left-0 absolute z-50'>
                <div
                    className='w-full h-[100vh]'
                    style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.501)'
                    }}
                    onClick={() => {
                        hideModal()
                        setIsReply('')
                        onClick()
                    }}
                />

                {
                    <div
                        ref={ref}
                    // className={`m-auto top-0 left-0 bottom-0 right-0 absolute`}
                    >
                        {body ? body : `Nội dung`}
                    </div>
                }
            </div>,
            el,
        );
    }


    else { return <></>; }
};

{/* <div className='flex flex-col justify-between h-full shadow-md rounded-lg w-full'>
    <div className='bg-white flex-1 flex items-center justify-center rounded-lg'>
        {body ? body : `Nội dung`}
    </div>

</div> */}
