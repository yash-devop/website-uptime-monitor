import { cn } from "@/lib/utils";
import React from "react";

type VariantsProps = "icon" | "sm" | "md" | "lg" | "text";
type ClassName = {
  className?: string;
};
export function Control({
  variant,
  className,
}: {
  variant: VariantsProps;
  className?: string;
}) {
  const logos: {
    [key: string]: React.JSX.Element;
  } = {
    icon: <IconLogo className={className} />,
    sm: <SmallLogo className={className} />,
    md: <MediumLogo className={className} />,
    lg: <LargeLogo className={className} />,
    text: <TextLogo className={className} />,
  };
  return <>{logos[variant]}</>;
}

function IconLogo({ className }: ClassName) {
  return (
    <>
      <svg
        width="24"
        height="28"
        viewBox="0 0 24 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <circle
          cx="9.31868"
          cy="10.4835"
          r="8.15385"
          stroke="#00F48E"
          strokeWidth="2.32967"
        />
        <circle
          cx="13.9779"
          cy="17.4725"
          r="8.15385"
          stroke="#00F48E"
          strokeWidth="2.32967"
        />
      </svg>
    </>
  );
}
function SmallLogo({ className }: ClassName) {
  return (
    <svg
      className={className}
      width="106"
      height="28"
      viewBox="0 0 106 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="9.54964"
        cy="10.4835"
        r="8.15385"
        stroke="#00F48E"
        strokeWidth="2.32967"
      />
      <circle
        cx="14.2088"
        cy="17.4725"
        r="8.15385"
        stroke="#00F48E"
        strokeWidth="2.32967"
      />
      <path
        d="M35.083 21.7088C33.9761 21.7088 33.023 21.4582 32.2238 20.9568C31.4296 20.4505 30.8191 19.7531 30.3922 18.8646C29.9653 17.9761 29.7519 16.9585 29.7519 15.8119C29.7519 14.6503 29.9703 13.6253 30.4071 12.7368C30.8439 11.8433 31.4594 11.1459 32.2536 10.6446C33.0478 10.1432 33.9835 9.89255 35.0606 9.89255C35.9293 9.89255 36.7037 10.0539 37.3837 10.3765C38.0637 10.6942 38.6122 11.1409 39.0292 11.7167C39.4511 12.2925 39.7018 12.9651 39.7812 13.7345H37.6145C37.4954 13.1984 37.2224 12.7368 36.7955 12.3496C36.3736 11.9624 35.8077 11.7689 35.0979 11.7689C34.4774 11.7689 33.9339 11.9327 33.4673 12.2603C33.0056 12.5829 32.6458 13.0446 32.3876 13.6452C32.1295 14.2408 32.0005 14.9457 32.0005 15.7597C32.0005 16.5937 32.127 17.3134 32.3802 17.919C32.6334 18.5246 32.9907 18.9937 33.4524 19.3262C33.919 19.6588 34.4675 19.8251 35.0979 19.8251C35.5198 19.8251 35.902 19.7481 36.2445 19.5943C36.592 19.4354 36.8824 19.2096 37.1157 18.9167C37.3539 18.6239 37.5202 18.2714 37.6145 17.8594H39.7812C39.7018 18.599 39.461 19.2592 39.059 19.84C38.6569 20.4207 38.1183 20.8774 37.4433 21.21C36.7731 21.5426 35.9864 21.7088 35.083 21.7088ZM46.9793 21.7088C45.9071 21.7088 44.9715 21.4631 44.1723 20.9717C43.3731 20.4803 42.7526 19.7928 42.3109 18.9093C41.8691 18.0257 41.6482 16.9932 41.6482 15.8119C41.6482 14.6255 41.8691 13.5881 42.3109 12.6996C42.7526 11.8111 43.3731 11.1211 44.1723 10.6297C44.9715 10.1383 45.9071 9.89255 46.9793 9.89255C48.0515 9.89255 48.9872 10.1383 49.7863 10.6297C50.5855 11.1211 51.206 11.8111 51.6478 12.6996C52.0895 13.5881 52.3104 14.6255 52.3104 15.8119C52.3104 16.9932 52.0895 18.0257 51.6478 18.9093C51.206 19.7928 50.5855 20.4803 49.7863 20.9717C48.9872 21.4631 48.0515 21.7088 46.9793 21.7088ZM46.9868 19.84C47.6817 19.84 48.2575 19.6563 48.7142 19.289C49.1708 18.9217 49.5084 18.4327 49.7268 17.8222C49.9501 17.2117 50.0618 16.5391 50.0618 15.8044C50.0618 15.0747 49.9501 14.4046 49.7268 13.7941C49.5084 13.1786 49.1708 12.6847 48.7142 12.3124C48.2575 11.9401 47.6817 11.754 46.9868 11.754C46.2869 11.754 45.7061 11.9401 45.2445 12.3124C44.7878 12.6847 44.4478 13.1786 44.2244 13.7941C44.006 14.4046 43.8968 15.0747 43.8968 15.8044C43.8968 16.5391 44.006 17.2117 44.2244 17.8222C44.4478 18.4327 44.7878 18.9217 45.2445 19.289C45.7061 19.6563 46.2869 19.84 46.9868 19.84ZM57.0217 14.6876V21.478H54.7954V10.0415H56.9323V11.9029H57.0738C57.3369 11.2973 57.7489 10.8109 58.3098 10.4435C58.8756 10.0762 59.588 9.89255 60.4467 9.89255C61.226 9.89255 61.9085 10.0564 62.4942 10.384C63.08 10.7066 63.5342 11.1881 63.8568 11.8284C64.1795 12.4688 64.3408 13.2605 64.3408 14.2036V21.478H62.1145V14.4716C62.1145 13.6427 61.8986 12.9949 61.4667 12.5283C61.0349 12.0568 60.4417 11.821 59.6872 11.821C59.171 11.821 58.7118 11.9327 58.3098 12.156C57.9127 12.3794 57.5975 12.707 57.3642 13.1389C57.1358 13.5658 57.0217 14.082 57.0217 14.6876ZM72.665 10.0415V11.8284H66.4181V10.0415H72.665ZM68.0934 7.30145H70.3197V18.12C70.3197 18.5519 70.3842 18.877 70.5132 19.0954C70.6423 19.3089 70.8086 19.4553 71.0121 19.5347C71.2206 19.6092 71.4464 19.6464 71.6897 19.6464C71.8684 19.6464 72.0247 19.634 72.1587 19.6092C72.2928 19.5843 72.397 19.5645 72.4715 19.5496L72.8735 21.3887C72.7445 21.4383 72.5608 21.488 72.3225 21.5376C72.0843 21.5922 71.7865 21.622 71.4291 21.6269C70.8433 21.6369 70.2973 21.5326 69.791 21.3142C69.2847 21.0958 68.8752 20.7583 68.5625 20.3016C68.2498 19.8449 68.0934 19.2716 68.0934 18.5817V7.30145ZM75.1277 21.478V10.0415H77.2795V11.8582H77.3986C77.6071 11.2427 77.9744 10.7587 78.5006 10.4063C79.0317 10.0489 79.6323 9.87021 80.3025 9.87021C80.4414 9.87021 80.6052 9.87518 80.7939 9.8851C80.9875 9.89503 81.1388 9.90744 81.2481 9.92233V12.0518C81.1587 12.027 80.9999 11.9997 80.7715 11.9699C80.5432 11.9351 80.3149 11.9178 80.0865 11.9178C79.5604 11.9178 79.0913 12.0295 78.6793 12.2528C78.2723 12.4712 77.9496 12.7765 77.7114 13.1686C77.4731 13.5558 77.354 13.9976 77.354 14.494V21.478H75.1277ZM87.5825 21.7088C86.5103 21.7088 85.5746 21.4631 84.7754 20.9717C83.9763 20.4803 83.3558 19.7928 82.914 18.9093C82.4722 18.0257 82.2514 16.9932 82.2514 15.8119C82.2514 14.6255 82.4722 13.5881 82.914 12.6996C83.3558 11.8111 83.9763 11.1211 84.7754 10.6297C85.5746 10.1383 86.5103 9.89255 87.5825 9.89255C88.6546 9.89255 89.5903 10.1383 90.3895 10.6297C91.1887 11.1211 91.8091 11.8111 92.2509 12.6996C92.6927 13.5881 92.9136 14.6255 92.9136 15.8119C92.9136 16.9932 92.6927 18.0257 92.2509 18.9093C91.8091 19.7928 91.1887 20.4803 90.3895 20.9717C89.5903 21.4631 88.6546 21.7088 87.5825 21.7088ZM87.5899 19.84C88.2848 19.84 88.8606 19.6563 89.3173 19.289C89.774 18.9217 90.1115 18.4327 90.3299 17.8222C90.5533 17.2117 90.665 16.5391 90.665 15.8044C90.665 15.0747 90.5533 14.4046 90.3299 13.7941C90.1115 13.1786 89.774 12.6847 89.3173 12.3124C88.8606 11.9401 88.2848 11.754 87.5899 11.754C86.89 11.754 86.3093 11.9401 85.8476 12.3124C85.391 12.6847 85.0509 13.1786 84.8276 13.7941C84.6092 14.4046 84.5 15.0747 84.5 15.8044C84.5 16.5391 84.6092 17.2117 84.8276 17.8222C85.0509 18.4327 85.391 18.9217 85.8476 19.289C86.3093 19.6563 86.89 19.84 87.5899 19.84ZM97.6248 6.22928V21.478H95.3986V6.22928H97.6248ZM102.087 21.6195C101.68 21.6195 101.33 21.4755 101.037 21.1876C100.744 20.8948 100.598 20.5424 100.598 20.1304C100.598 19.7233 100.744 19.3759 101.037 19.088C101.33 18.7951 101.68 18.6487 102.087 18.6487C102.494 18.6487 102.844 18.7951 103.136 19.088C103.429 19.3759 103.576 19.7233 103.576 20.1304C103.576 20.4034 103.506 20.654 103.367 20.8824C103.233 21.1057 103.055 21.2844 102.831 21.4185C102.608 21.5525 102.36 21.6195 102.087 21.6195Z"
        fill="white"
      />
    </svg>
  );
}
function MediumLogo({ className }: ClassName) {
  return (
    <svg
      className={className}
      width="133"
      height="35"
      viewBox="0 0 133 35"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="12.1564"
        cy="13.1249"
        r="10.2083"
        stroke="#00F48E"
        strokeWidth="2.91667"
      />
      <circle
        cx="17.9899"
        cy="21.8749"
        r="10.2083"
        stroke="#00F48E"
        strokeWidth="2.91667"
      />
      <path
        d="M44.1236 27.789C42.7377 27.789 41.5446 27.4751 40.544 26.8475C39.5497 26.2136 38.7853 25.3405 38.2509 24.2281C37.7164 23.1157 37.4492 21.8417 37.4492 20.4062C37.4492 18.952 37.7227 17.6687 38.2695 16.5563C38.8164 15.4377 39.587 14.5645 40.5813 13.9369C41.5756 13.3092 42.7471 12.9954 44.0956 12.9954C45.1831 12.9954 46.1526 13.1974 47.004 13.6013C47.8554 13.999 48.5421 14.5583 49.0641 15.2792C49.5923 16.0001 49.9062 16.8422 50.0056 17.8054H47.293C47.1438 17.1342 46.802 16.5563 46.2676 16.0716C45.7393 15.5868 45.0309 15.3445 44.1422 15.3445C43.3654 15.3445 42.6849 15.5495 42.1008 15.9597C41.5228 16.3636 41.0723 16.9416 40.7491 17.6935C40.426 18.4393 40.2644 19.3217 40.2644 20.3409C40.2644 21.3849 40.4229 22.286 40.7398 23.0442C41.0567 23.8024 41.5042 24.3896 42.0821 24.806C42.6663 25.2224 43.353 25.4306 44.1422 25.4306C44.6705 25.4306 45.149 25.3343 45.5778 25.1416C46.0128 24.9427 46.3763 24.66 46.6684 24.2933C46.9667 23.9267 47.1749 23.4854 47.293 22.9696H50.0056C49.9062 23.8956 49.6048 24.7221 49.1014 25.4492C48.598 26.1763 47.9237 26.748 47.0786 27.1644C46.2396 27.5808 45.2546 27.789 44.1236 27.789ZM59.0174 27.789C57.675 27.789 56.5036 27.4814 55.5031 26.8661C54.5026 26.2509 53.7257 25.3902 53.1727 24.284C52.6196 23.1778 52.343 21.8852 52.343 20.4062C52.343 18.9209 52.6196 17.6221 53.1727 16.5097C53.7257 15.3973 54.5026 14.5335 55.5031 13.9182C56.5036 13.303 57.675 12.9954 59.0174 12.9954C60.3597 12.9954 61.5311 13.303 62.5317 13.9182C63.5322 14.5335 64.309 15.3973 64.8621 16.5097C65.4152 17.6221 65.6917 18.9209 65.6917 20.4062C65.6917 21.8852 65.4152 23.1778 64.8621 24.284C64.309 25.3902 63.5322 26.2509 62.5317 26.8661C61.5311 27.4814 60.3597 27.789 59.0174 27.789ZM59.0267 25.4492C59.8967 25.4492 60.6176 25.2193 61.1893 24.7594C61.7611 24.2995 62.1837 23.6874 62.4571 22.923C62.7368 22.1586 62.8766 21.3166 62.8766 20.3968C62.8766 19.4833 62.7368 18.6444 62.4571 17.88C62.1837 17.1094 61.7611 16.491 61.1893 16.0249C60.6176 15.5589 59.8967 15.3258 59.0267 15.3258C58.1505 15.3258 57.4234 15.5589 56.8454 16.0249C56.2737 16.491 55.848 17.1094 55.5683 17.88C55.2949 18.6444 55.1582 19.4833 55.1582 20.3968C55.1582 21.3166 55.2949 22.1586 55.5683 22.923C55.848 23.6874 56.2737 24.2995 56.8454 24.7594C57.4234 25.2193 58.1505 25.4492 59.0267 25.4492ZM71.5901 18.9986V27.5H68.8029V13.1818H71.4782V15.5123H71.6553C71.9847 14.7541 72.5005 14.1451 73.2027 13.6852C73.9112 13.2253 74.803 12.9954 75.8781 12.9954C76.8537 12.9954 77.7082 13.2005 78.4415 13.6106C79.1748 14.0146 79.7435 14.6174 80.1474 15.419C80.5514 16.2207 80.7533 17.2119 80.7533 18.3927V27.5H77.9661V18.7282C77.9661 17.6904 77.6958 16.8794 77.1551 16.2953C76.6145 15.7049 75.8718 15.4097 74.9272 15.4097C74.2809 15.4097 73.7061 15.5495 73.2027 15.8292C72.7056 16.1088 72.3109 16.519 72.0189 17.0597C71.733 17.5941 71.5901 18.2404 71.5901 18.9986ZM91.175 13.1818V15.419H83.3541V13.1818H91.175ZM85.4515 9.75142H88.2387V23.2959C88.2387 23.8366 88.3195 24.2436 88.481 24.517C88.6426 24.7843 88.8508 24.9676 89.1056 25.067C89.3666 25.1602 89.6494 25.2069 89.9539 25.2069C90.1776 25.2069 90.3734 25.1913 90.5411 25.1602C90.7089 25.1292 90.8394 25.1043 90.9327 25.0857L91.436 27.3881C91.2745 27.4503 91.0445 27.5124 90.7462 27.5746C90.4479 27.6429 90.0751 27.6802 89.6276 27.6864C88.8943 27.6989 88.2107 27.5684 87.5768 27.2949C86.943 27.0215 86.4303 26.5989 86.0388 26.0272C85.6472 25.4554 85.4515 24.7377 85.4515 23.8738V9.75142ZM94.2582 27.5V13.1818H96.9522V15.4563H97.1013C97.3623 14.6857 97.8222 14.0798 98.4809 13.6386C99.1459 13.1911 99.8978 12.9674 100.737 12.9674C100.911 12.9674 101.116 12.9736 101.352 12.9861C101.594 12.9985 101.784 13.014 101.921 13.0327V15.6987C101.809 15.6676 101.61 15.6334 101.324 15.5961C101.038 15.5526 100.752 15.5309 100.466 15.5309C99.8077 15.5309 99.2205 15.6707 98.7047 15.9504C98.1951 16.2238 97.7911 16.606 97.4928 17.0969C97.1945 17.5817 97.0454 18.1348 97.0454 18.7562V27.5H94.2582ZM109.851 27.789C108.509 27.789 107.337 27.4814 106.337 26.8661C105.336 26.2509 104.559 25.3902 104.006 24.284C103.453 23.1778 103.177 21.8852 103.177 20.4062C103.177 18.9209 103.453 17.6221 104.006 16.5097C104.559 15.3973 105.336 14.5335 106.337 13.9182C107.337 13.303 108.509 12.9954 109.851 12.9954C111.193 12.9954 112.365 13.303 113.365 13.9182C114.366 14.5335 115.143 15.3973 115.696 16.5097C116.249 17.6221 116.525 18.9209 116.525 20.4062C116.525 21.8852 116.249 23.1778 115.696 24.284C115.143 25.3902 114.366 26.2509 113.365 26.8661C112.365 27.4814 111.193 27.789 109.851 27.789ZM109.86 25.4492C110.73 25.4492 111.451 25.2193 112.023 24.7594C112.595 24.2995 113.017 23.6874 113.291 22.923C113.57 22.1586 113.71 21.3166 113.71 20.3968C113.71 19.4833 113.57 18.6444 113.291 17.88C113.017 17.1094 112.595 16.491 112.023 16.0249C111.451 15.5589 110.73 15.3258 109.86 15.3258C108.984 15.3258 108.257 15.5589 107.679 16.0249C107.107 16.491 106.682 17.1094 106.402 17.88C106.129 18.6444 105.992 19.4833 105.992 20.3968C105.992 21.3166 106.129 22.1586 106.402 22.923C106.682 23.6874 107.107 24.2995 107.679 24.7594C108.257 25.2193 108.984 25.4492 109.86 25.4492ZM122.424 8.40909V27.5H119.637V8.40909H122.424ZM128.01 27.6771C127.5 27.6771 127.062 27.4969 126.695 27.1365C126.329 26.7698 126.146 26.3286 126.146 25.8128C126.146 25.3032 126.329 24.8682 126.695 24.5077C127.062 24.1411 127.5 23.9577 128.01 23.9577C128.519 23.9577 128.958 24.1411 129.324 24.5077C129.691 24.8682 129.874 25.3032 129.874 25.8128C129.874 26.1546 129.787 26.4684 129.613 26.7543C129.445 27.0339 129.222 27.2576 128.942 27.4254C128.662 27.5932 128.352 27.6771 128.01 27.6771Z"
        fill="white"
      />
    </svg>
  );
}
function LargeLogo({ className }: ClassName) {
  return (
    <svg
      className={className}
      width="182"
      height="48"
      viewBox="0 0 182 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="17" cy="18" r="14" stroke="#00F48E" strokeWidth="4" />
      <circle cx="25" cy="30" r="14" stroke="#00F48E" strokeWidth="4" />
      <path
        d="M60.8409 37.3963C58.9403 37.3963 57.304 36.9659 55.9318 36.1051C54.5682 35.2358 53.5199 34.0384 52.7869 32.5128C52.054 30.9872 51.6875 29.2401 51.6875 27.2713C51.6875 25.277 52.0625 23.517 52.8125 21.9915C53.5625 20.4574 54.6193 19.2599 55.983 18.3991C57.3466 17.5384 58.9531 17.108 60.8026 17.108C62.294 17.108 63.6236 17.3849 64.7912 17.9389C65.9588 18.4844 66.9006 19.2514 67.6165 20.2401C68.3409 21.2287 68.7713 22.3835 68.9077 23.7045H65.1875C64.983 22.7841 64.5142 21.9915 63.7812 21.3267C63.0568 20.6619 62.0852 20.3295 60.8665 20.3295C59.8011 20.3295 58.8679 20.6108 58.0668 21.1733C57.2741 21.7273 56.6563 22.5199 56.2131 23.5511C55.7699 24.5739 55.5483 25.7841 55.5483 27.1818C55.5483 28.6136 55.7656 29.8494 56.2003 30.8892C56.6349 31.929 57.2486 32.7344 58.0412 33.3054C58.8423 33.8764 59.7841 34.1619 60.8665 34.1619C61.5909 34.1619 62.2472 34.0298 62.8352 33.7656C63.4318 33.4929 63.9304 33.1051 64.331 32.6023C64.7401 32.0994 65.0256 31.4943 65.1875 30.7869H68.9077C68.7713 32.0568 68.358 33.1903 67.6676 34.1875C66.9773 35.1847 66.0526 35.9687 64.8935 36.5398C63.7429 37.1108 62.392 37.3963 60.8409 37.3963ZM81.2667 37.3963C79.4258 37.3963 77.8192 36.9744 76.4471 36.1307C75.0749 35.2869 74.0096 34.1065 73.2511 32.5895C72.4925 31.0724 72.1133 29.2997 72.1133 27.2713C72.1133 25.2344 72.4925 23.4531 73.2511 21.9276C74.0096 20.402 75.0749 19.2173 76.4471 18.3736C77.8192 17.5298 79.4258 17.108 81.2667 17.108C83.1076 17.108 84.7141 17.5298 86.0863 18.3736C87.4585 19.2173 88.5238 20.402 89.2823 21.9276C90.0408 23.4531 90.4201 25.2344 90.4201 27.2713C90.4201 29.2997 90.0408 31.0724 89.2823 32.5895C88.5238 34.1065 87.4585 35.2869 86.0863 36.1307C84.7141 36.9744 83.1076 37.3963 81.2667 37.3963ZM81.2795 34.1875C82.4727 34.1875 83.4613 33.8722 84.2454 33.2415C85.0295 32.6108 85.609 31.7713 85.984 30.723C86.3675 29.6747 86.5593 28.5199 86.5593 27.2585C86.5593 26.0057 86.3675 24.8551 85.984 23.8068C85.609 22.75 85.0295 21.902 84.2454 21.2628C83.4613 20.6236 82.4727 20.304 81.2795 20.304C80.0778 20.304 79.0806 20.6236 78.288 21.2628C77.5039 21.902 76.9201 22.75 76.5366 23.8068C76.1616 24.8551 75.9741 26.0057 75.9741 27.2585C75.9741 28.5199 76.1616 29.6747 76.5366 30.723C76.9201 31.7713 77.5039 32.6108 78.288 33.2415C79.0806 33.8722 80.0778 34.1875 81.2795 34.1875ZM98.5092 25.3409V37H94.6868V17.3636H98.3558V20.5597H98.5987C99.0504 19.5199 99.7578 18.6847 100.721 18.054C101.692 17.4233 102.915 17.108 104.39 17.108C105.728 17.108 106.9 17.3892 107.906 17.9517C108.911 18.5057 109.691 19.3324 110.245 20.4318C110.799 21.5312 111.076 22.8906 111.076 24.5099V37H107.254V24.9702C107.254 23.5469 106.883 22.4347 106.141 21.6335C105.4 20.8239 104.381 20.419 103.086 20.419C102.2 20.419 101.411 20.6108 100.721 20.9943C100.039 21.3778 99.4979 21.9403 99.0973 22.6818C98.7053 23.4148 98.5092 24.3011 98.5092 25.3409ZM125.369 17.3636V20.4318H114.643V17.3636H125.369ZM117.519 12.6591H121.342V31.2344C121.342 31.9759 121.452 32.5341 121.674 32.9091C121.896 33.2756 122.181 33.527 122.531 33.6634C122.888 33.7912 123.276 33.8551 123.694 33.8551C124.001 33.8551 124.269 33.8338 124.499 33.7912C124.729 33.7486 124.908 33.7145 125.036 33.6889L125.727 36.8466C125.505 36.9318 125.19 37.017 124.781 37.1023C124.371 37.196 123.86 37.2472 123.246 37.2557C122.241 37.2727 121.303 37.0938 120.434 36.7188C119.565 36.3438 118.862 35.7642 118.325 34.9801C117.788 34.196 117.519 33.2116 117.519 32.027V12.6591ZM129.597 37V17.3636H133.292V20.483H133.496C133.854 19.4261 134.485 18.5952 135.388 17.9901C136.3 17.3764 137.331 17.0696 138.482 17.0696C138.721 17.0696 139.002 17.0781 139.326 17.0952C139.658 17.1122 139.918 17.1335 140.105 17.1591V20.8153C139.952 20.7727 139.679 20.7259 139.287 20.6747C138.895 20.6151 138.503 20.5852 138.111 20.5852C137.208 20.5852 136.402 20.777 135.695 21.1605C134.996 21.5355 134.442 22.0597 134.033 22.733C133.624 23.3977 133.419 24.1562 133.419 25.0085V37H129.597ZM150.982 37.3963C149.141 37.3963 147.534 36.9744 146.162 36.1307C144.79 35.2869 143.724 34.1065 142.966 32.5895C142.207 31.0724 141.828 29.2997 141.828 27.2713C141.828 25.2344 142.207 23.4531 142.966 21.9276C143.724 20.402 144.79 19.2173 146.162 18.3736C147.534 17.5298 149.141 17.108 150.982 17.108C152.822 17.108 154.429 17.5298 155.801 18.3736C157.173 19.2173 158.239 20.402 158.997 21.9276C159.756 23.4531 160.135 25.2344 160.135 27.2713C160.135 29.2997 159.756 31.0724 158.997 32.5895C158.239 34.1065 157.173 35.2869 155.801 36.1307C154.429 36.9744 152.822 37.3963 150.982 37.3963ZM150.994 34.1875C152.188 34.1875 153.176 33.8722 153.96 33.2415C154.744 32.6108 155.324 31.7713 155.699 30.723C156.082 29.6747 156.274 28.5199 156.274 27.2585C156.274 26.0057 156.082 24.8551 155.699 23.8068C155.324 22.75 154.744 21.902 153.96 21.2628C153.176 20.6236 152.188 20.304 150.994 20.304C149.793 20.304 148.795 20.6236 148.003 21.2628C147.219 21.902 146.635 22.75 146.251 23.8068C145.876 24.8551 145.689 26.0057 145.689 27.2585C145.689 28.5199 145.876 29.6747 146.251 30.723C146.635 31.7713 147.219 32.6108 148.003 33.2415C148.795 33.8722 149.793 34.1875 150.994 34.1875ZM168.224 10.8182V37H164.402V10.8182H168.224ZM175.885 37.2429C175.186 37.2429 174.585 36.9957 174.082 36.5014C173.58 35.9986 173.328 35.3935 173.328 34.6861C173.328 33.9872 173.58 33.3906 174.082 32.8963C174.585 32.3935 175.186 32.142 175.885 32.142C176.584 32.142 177.185 32.3935 177.688 32.8963C178.19 33.3906 178.442 33.9872 178.442 34.6861C178.442 35.1548 178.322 35.5852 178.084 35.9773C177.854 36.3608 177.547 36.6676 177.163 36.8977C176.78 37.1278 176.354 37.2429 175.885 37.2429Z"
        fill="white"
      />
    </svg>
  );
}

function TextLogo({ className }: ClassName) {
  return (
    <p className={cn("text-xl tracking-tighter select-none", className)}>
      control.
    </p>
  );
}
