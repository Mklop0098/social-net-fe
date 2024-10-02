import { Divider } from "@mui/material";
import { FiMenu } from "react-icons/fi";

export type CategoryType = {
    productCategoryId: string;
    name: string;
    slug: string;
    image?: {
        mediaItemUrl: string;
    };
}

const category: CategoryType[] = [
    {
        productCategoryId: "1",
        name: "Đồng phục",
        slug: "uniform",
    },
    {
        productCategoryId: "2",
        name: "Dụng cụ thể thao",
        slug: "products",
    },
    {
        productCategoryId: "4",
        name: "Thuê dịch vụ",
        slug: "thue-dich-vu",
    },
    {
        productCategoryId: "5",
        name: "Sân thể thao",
        slug: "fields",
    },

]

export const Catalog = () => {


    return (
        <div className="flex flex-col justify-between shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-md -z-10">

            <div className="p-3 bg-[--primary-color] text-white font-semibold text-lg rounded-tl-md rounded-tr-md flex flex-row items-center">
                <FiMenu size={20} className="mr-3" />
                <span>Danh mục</span>
            </div>
            <Divider />
            {
                category.map((item, key) => (
                    <div onClick={() => {
                        // route.push(`/${item.slug}`)
                    }} className="cursor-pointer group flex py-3 flex-row justify-between flex-1 px-3 items-center hover:bg-[#f2f3f7]" key={key}>
                        <div className="flex flex-row items-center group-hover:text-[--primary-color] x`">
                            {item.image?.mediaItemUrl && <img src={item.image.mediaItemUrl} alt="pic" className="w-8 h-8 mr-2" />}
                            <span className="pl-2 text-sm">{item.name}</span>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}