export function Header({ navLinks }) {
  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Motion Dynamics home">
        <img src="/assets/Logo/motion-dynamics-logo.svg" alt="" />
      </a>
      <nav aria-label="Primary navigation">
        {navLinks.map((link) => (
          <a href={link.link} key={link.id}>
            {link.title}
          </a>
        ))}
      </nav>
    </header>
  );
}
