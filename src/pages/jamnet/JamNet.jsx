import { useLocation } from "react-router-dom";
import { NavListButton, OutlineLinkButton } from "../../components/ui/navigationButtons"
import { getAllPosts } from "../../api/cmsApi";
import { useQuery } from "react-query";
import Circular from "../../components/ui/Circular";
import { useState } from "react";

const JamNet = () => {
    const location = useLocation();
    const [posts, setPosts] = useState()

    const { data: fetchedPosts, isLoading: postsIsLoading } =
        useQuery('posts', getAllPosts, {
            onSuccess: (result) => {
                setPosts(result.results.reverse())
            },
            refetchOnWindowFocus: false
        })

    return (
        <div className="h-custom-screen w-full">
            <div className='flex flex-col py-4 gap-10 h-full overflow-auto'>
                {
                    postsIsLoading ?
                        <Circular />
                        :
                        <div className='grid grid-cols-12 gap-2'>
                            {
                                posts?.map((post) => (
                                    <div key={post.post_id} className="flex flex-col bg-navy overflow-hidden pb-4 rounded-2xl gap-4 col-span-12 xs:col-span-6 lg:col-span-4">
                                        <img src={post.image} className="w-full aspect-video bg-gray-dark" />
                                        <div className="flex flex-col gap-2  px-5">
                                            <b>{post.title}</b>
                                            <p className="line-clamp-3 overflow-hidden text-right mb-3">{post.extracted_body}</p>
                                            <OutlineLinkButton text={'بیشتر'} from={location.pathname} path={post.slug} />
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                }
            </div>
        </div>
    )
}

export default JamNet