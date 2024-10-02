import { PropsWithChildren, createContext, useContext, useState } from 'react';
import { Modal } from '../../components/Modal';
import { ModalContextProviderReturn, ModalType } from '../../type';


export const ModalContext = createContext<ModalContextProviderReturn>({} as ModalContextProviderReturn);

export const useModal = (): ModalContextProviderReturn => {
    return useContext(ModalContext);
};


export const ModalContextProvider: React.FC<PropsWithChildren> = (props) => {
    const [modal, setModal] = useState<ModalType>({} as ModalType);

    const hideModal = () => {
        setModal({ ...modal, 'toggle': false });
    };

    const showModal = (modal: ModalType) => {
        setModal(modal);
    };

    return (
        <ModalContext.Provider value={{ showModal, hideModal }}>
            {props.children}
            <Modal
                toggle={modal.toggle}
                root={modal.root || 'modal-root'}
                body={modal.body}
                width={modal.width || 20}
                height={modal.height || 25}
                onClick={modal.onClick}
            />
        </ModalContext.Provider>
    );
};