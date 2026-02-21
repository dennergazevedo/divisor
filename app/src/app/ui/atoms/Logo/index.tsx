type LogoProps = {
  color?: string;
  size?: number | string;
};

export default function Logo({ color = "#8200db", size = 160 }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 157 89"
      width={size}
      height="auto"
      style={{ display: "block" }}
      className="mt-1"
    >
      <path
        fill={color}
        stroke="transparent"
        fillOpacity="1"
        strokeWidth="1"
        strokeOpacity="0"
        d="M1 44.4994C1 44.4994 61 1.1981 61 1.1981C61 1.1981 61 87.8006 61 87.8006C61 87.8006 1 44.4994 1 44.4994ZM156 44.4994C156 44.4994 96 87.8006 96 87.8006C96 87.8006 96 1.1981 96 1.1981C96 1.1981 156 44.4994 156 44.4994Z"
      />

      <path
        fill={color}
        fillOpacity="1"
        strokeOpacity="0"
        strokeWidth="1"
        d="M74.5 0.9994H82.5V87.9994H74.5Z"
        style={{
          transformOrigin: "78.5px 44.5px",
          transformBox: "fill-box",
        }}
      />
    </svg>
  );
}
