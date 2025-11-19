export default function NavbarMain(){
    return (
      <header className="flex flex-row items-around justify-center">
        <h1>{page}</h1>
        <span className="flex flex-row items-center justify-around">
            {notification bell}
            <Image src={image} alt=""/>

        </span>
      </header>
    );
}