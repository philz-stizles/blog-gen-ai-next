import Link from "next/link";

const Button = ({ children, className, href, onClick, type }) => {
  let classes = `btn ${className ? ` ${className}` : ""}`;

  return href ? (
    <Link href={href} className={classes}>
      {children}
    </Link>
  ) : (
    <button type={type || 'button'} className={classes} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
