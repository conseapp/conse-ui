import { useMutation, useQuery, useQueryClient } from "react-query"
import { addPostComment, getSinglePost, getSinglePostComments } from "../../api/cmsApi"
import { useParams } from "react-router-dom"
import Circular from "../../components/ui/Circular"
import { TextareaInput } from "../../components/ui/inputs"
import { SubmitButton } from "../../components/ui/buttons"
import { useState } from "react"
import { useSelector } from "react-redux"
import { toast } from "react-toastify"


const SinglePost = () => {
    const globalUser = useSelector(state => state.userReducer)
    const { postSlug } = useParams()
    const [comment, setComment] = useState('')
    const client = useQueryClient()


    const { data: singlePost, isLoading: postIsLoading } =
        useQuery(`single-post-${postSlug}`, () => getSinglePost(postSlug), {
            refetchOnWindowFocus: false
        })
    const { data: singlePostComments, isLoading: commentsIsLoading } =
        useQuery(`single-post-${postSlug}-comments`, () => getSinglePostComments(postSlug), {
            refetchOnWindowFocus: false
        })

    const { mutate: addCommentMutation } = useMutation(addPostComment,
        {
            onSuccess: (result) => {
                toast.success('دیدگاه شما ثبت شد')
                setComment('')
                client.invalidateQueries(`single-post-${postSlug}-comments`)
            },
            onError: (error) => {
                toast.error('خطایی در هنگام ثبت دیدگاه پیش آمده')
            },
        })

    const handleSubmitComment = (e) => {
        e.preventDefault()
        const reqInfo = {
            token: globalUser.accessToken,
            slug: postSlug,
            content: comment,
            author: globalUser.username,
        }
        if (comment !== '') {
            addCommentMutation(reqInfo)
        }
    }

    return (
        <div className="w-full h-custom-screen flex flex-col items-center">
            {
                postIsLoading
                    ? <Circular />
                    :
                    <div className="flex flex-col h-full overflow-auto gap-5 items-center max-w-[1200px]">
                        <div className="flex flex-col gap-5 items-center bg-navy p-4 rounded-2xl">
                            <img src={singlePost?.image} className="w-full max-w-[1000px] aspect-video bg-gray-dark rounded-2xl" />
                            <div className="flex flex-col gap-3 px-2">
                                <h2 className="text-2xl">{singlePost?.title}</h2>
                                {/* <p className="text-right leading-loose">{singlePost?.extracted_body}</p> */}
                                <div className="text-right leading-loose" dangerouslySetInnerHTML={{ __html: singlePost?.body }}></div>
                                {/* <div className="text-right leading-loose">{singlePost?.body}</div> */}

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
                        <div className="flex flex-col w-full justify-between items-center gap-8 bg-navy p-4 rounded-2xl">
                            <form className="flex flex-col w-full gap-3 items-center px-2" onSubmit={handleSubmitComment}>
                                <TextareaInput value={comment} onChange={(e) => { setComment(e.target.value) }} disabled={false} id='comment-textarea' placeholder='دیدگاه خود را در مورد این مقاله بنویسید...' />
                                <SubmitButton text="ثبت" id={"submit-otp"} disabled={false} />
                            </form>
                            <div className="flex flex-col gap-4 w-full px-2">
                                {
                                    singlePostComments?.results.map(singleComment => (
                                        <div className="bg-gray-dark flex flex-col rounded-2xl w-full px-4 py-3.5 gap-3">
                                            <div className="flex gap-2 items-center justify-start">
                                                <div className="rounded-full bg-navy w-14 h-14"></div>
                                                <h3 className="">{singleComment.author}</h3>
                                            </div>
                                            <p className="text-sm text-right leading-loose">
                                                {singleComment.body}
                                            </p>
                                            <span>
                                                {singleComment.created_at}
                                            </span>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
            }
        </div>
    )
}
export default SinglePost