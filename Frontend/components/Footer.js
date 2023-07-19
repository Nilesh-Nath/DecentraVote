export default function Footer() {
  return (
    <div>
      <div className="h-16 flex justify-evenly items-center border-t-2 border-white">
        <p>© 2023 Decentralized Voting dApp. All rights reserved.</p>
        <div className="flex">
          <a
            className="mr-4"
            target="_blank"
            href="https://github.com/Nilesh-Nath"
          >
            <img width={35} src="/Github.jpg" />
          </a>
          <a href="https://www.linkedin.com/in/nilesh-nath/" target="_blank">
            <img width={35} src="/linkedIn.jpg" />
          </a>
        </div>
      </div>
    </div>
  );
}
