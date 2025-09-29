import abaCageLogo from "../assets/AbaCage.png";

export const Logo = () => {
  return (
    <div className="logo-container">
      <h1>AbaCage</h1>
      <img src={abaCageLogo} alt="AbaCage" />
    </div>
  );
};
