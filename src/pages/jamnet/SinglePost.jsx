import { useQuery } from "react-query"
import { getSinglePost } from "../../api/cmsApi"
import { useParams } from "react-router-dom"
import Circular from "../../components/ui/Circular"


const SinglePost = () => {
    const { postSlug } = useParams()


    const { data: singlePost, isLoading: postIsLoading } =
        useQuery(`single-post-${postSlug}`, () => getSinglePost(postSlug), {
            refetchOnWindowFocus: false
        })

    return (
        <div className="w-full h-custom-screen">
            {
                postIsLoading
                    ? <Circular />
                    :
                    <div className="flex flex-col h-full overflow-auto gap-5 items-center">
                        <img src={singlePost?.image} className="w-full max-w-2xl aspect-video bg-gray-dark rounded-2xl" />
                        <div className="flex flex-col gap-3 px-2">
                            <h2 className="text-2xl">{singlePost?.title}</h2>
                            <p className="text-right leading-loose">{singlePost?.extracted_body}</p>
                            {/* <div dangerouslySetInnerHTML={{__html:singlePost?.body}}></div> */}
                        </div>
                        <div className="flex w-full justify-between p-2">
                            <span className="text-black bg-secondary rounded-lg pt-1 px-2">
                                {singlePost?.category}
                            </span>
                            <span className="text-black bg-secondary rounded-lg pt-1 px-2">
                                {singlePost?.created_at}
                            </span>
                        </div>
                    </div>
            }
        </div>
    )
}
//category,title,extracted_body,created_at
export default SinglePost