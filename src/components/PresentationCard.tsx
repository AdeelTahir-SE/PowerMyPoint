export default function PresentationCard({Presentation}){
    return(
        <section className="flex flex-col items-center justify-center">
            <Image src={Presentation?.thumbnail} alt=""/>
            <div className="flex flex-row items-center justify-around">
                <span>{Presentation.author}</span>
                <span>{Presentation.views}</span>
                <span>{Presentation.checkPrompt}</span>
            </div>

        </section>
    )
}