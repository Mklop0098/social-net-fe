import { ref, listAll, getDownloadURL, StorageReference } from "firebase/storage";
import { imageDb } from '../../components/FirebaseImg/Config'


export const getAllImages = async () => {
    const storageRef: StorageReference = ref(imageDb, `background-story`)

    try {
        const result = await listAll(storageRef);
        const imageUrls = await Promise.all(
            result.items.map(async (itemRef) => {
                const url = await getDownloadURL(itemRef);
                return url;
            })
        );
        return imageUrls;
    } catch (error) {
        console.error('Error fetching images:', error);
    }
};

