export function Footer({ footerLinks, socialMedia }) {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <img src="/assets/Logo/motion-dynamics-logo.svg" alt="Motion Dynamics Logo" />
        <p>The future of sport development through advanced motion capture and biomechanical precision.</p>
      </div>

      <div className="footer-columns">
        {footerLinks.map((group) => (
          <div key={group.title}>
            <h4>{group.title}</h4>
            <ul>
              {group.links.map((link) => (
                <li key={link.title}>
                  <a href={link.link}>{link.title}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h4>Social</h4>
          <ul>
            {socialMedia.map((item) => (
              <li key={item.id}>
                <a href={item.link}>{item.name}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="copyright">© 2026 Motion Dynamics. All rights reserved.</p>
    </footer>
  );
}
