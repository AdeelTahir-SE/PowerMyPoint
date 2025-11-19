import PresentationCard from "@/components/PresentationCard"

export default function Page(){
    const presentation=[]
    return(
        <div className="flex flex-col items-center justify-center">

         {presentations&&presentation?.length>0&&presentations.map((v,i)=>{
            return(
                <PresentationCard Presentation={v}/>
            )
         })}


         {/* create Presentation Input */}
         <div className="relative z-20 bottom-8 flex flex-row items-center justify-around">
            <input type="text" placeholder="Create a new presentation.Give the prompt"/>
            <button>Create</button>
         </div>

        </div>
    )
}