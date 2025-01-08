import React from "react";

const NewsletterStars = (props: React.SVGProps<SVGSVGElement>, fill: string) => {
  return (
    <svg width='128' height='138' viewBox='0 0 128 138' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
      <path
        d='M23.8555 46.1544C26.9748 47.7147 30.0934 49.6025 32.71 52.2142C33.9991 53.5225 35.1318 54.9748 36.0856 56.5423C37.0135 58.0847 37.8018 59.7061 38.441 61.3876C39.7661 64.9221 40.4851 68.5784 41.0431 72.1613C41.1893 73.0503 41.3211 73.9388 41.4452 74.8243L41.8025 77.476L38.548 77.8795C38.0262 73.7085 37.6175 69.4226 37.9756 65.0747C38.3166 60.7461 39.4592 56.3351 41.7772 52.4717C42.359 51.5003 43.0138 50.5741 43.7358 49.701C44.4598 48.8117 45.2644 47.9906 46.1393 47.2479C46.3523 47.0526 46.5839 46.8832 46.8105 46.7065C47.0402 46.5344 47.2612 46.3477 47.4992 46.1886C47.9738 45.8683 48.4445 45.5378 48.9413 45.2593C49.9158 44.6819 50.9317 44.1765 51.9806 43.7472C53.0106 43.3232 54.0634 42.9563 55.1342 42.6483C56.1948 42.3535 57.2595 42.0809 58.3214 41.8675C60.4473 41.4179 62.5597 41.1148 64.6427 40.8169L64.848 44.7471L62.9919 44.7074C60.975 44.6697 58.94 44.5621 56.8892 44.3971C54.7899 44.2469 52.705 43.94 50.6519 43.4791C48.4874 42.9976 46.4134 42.1773 44.5071 41.0487C43.5223 40.4431 42.6119 39.7252 41.7942 38.9095C40.9798 38.0893 40.271 37.1715 39.684 36.1773C38.5244 34.2348 37.8132 32.2025 37.2053 30.2476C36.5915 28.2806 36.0803 26.2833 35.6738 24.2638C35.257 22.2476 34.9594 20.2089 34.7824 18.1581C34.6972 17.1331 34.6307 16.107 34.5986 15.0797L34.5749 14.3094C34.5688 14.0528 34.5753 13.7955 34.5537 13.5392C34.524 13.0262 34.5176 12.5123 34.4987 11.9985L37.9981 12.1634C37.704 15.9125 37.3893 19.7256 36.6636 23.5574C36.5647 24.0355 36.4741 24.5157 36.3673 24.9926L36.0084 26.4212L35.5984 27.8441L35.1321 29.2577C34.4713 31.1565 33.6277 32.9872 32.6132 34.7243C30.6515 38.0081 27.9609 40.8013 24.7475 42.8899C23.5052 43.7216 22.146 44.3655 20.7143 44.8009C20.1914 44.9499 19.6575 45.0573 19.1175 45.1219C18.8769 45.148 18.6501 45.165 18.4372 45.1729L18.28 45.1775L18.1527 45.1616C18.0634 45.1494 17.9772 45.1377 17.8942 45.1264C16.8647 44.9767 16.2931 44.7983 17.0862 44.0219C17.201 43.9142 17.3223 43.8137 17.4496 43.7209C17.5161 43.6694 17.6101 43.611 17.67 43.5622C17.7258 43.5158 17.784 43.4674 17.8447 43.4169C18.0873 43.2166 18.3803 43.0209 18.7038 42.7893C19.0246 42.5521 19.3975 42.3266 19.7891 42.0479C19.9878 41.9159 20.1954 41.7779 20.4119 41.6341C20.6243 41.4843 20.8466 41.3323 21.0788 41.1779C22.2804 40.3573 23.4268 39.4593 24.5106 38.4897C25.6175 37.515 26.6473 36.4568 27.5908 35.3245C28.8768 33.763 29.9578 32.0446 30.8076 30.211C31.6666 28.3384 32.35 26.3908 32.8491 24.3929C33.9206 20.3665 34.4051 16.1313 34.8597 11.8625L34.86 11.8601C34.8978 11.5065 35.07 11.1806 35.3413 10.9492C35.6126 10.7178 35.9625 10.5985 36.3193 10.6156C36.6761 10.6328 37.0128 10.7851 37.2605 11.0413C37.5081 11.2976 37.648 11.6385 37.6515 11.9941C37.6579 12.6867 37.6349 13.3805 37.6836 14.0724C37.7277 14.7641 37.78 15.4549 37.8503 16.144C37.9848 17.5226 38.1845 18.8929 38.4126 20.2561C38.8639 22.9807 39.5252 25.6667 40.3909 28.2902C40.9445 30.0843 41.6637 31.8235 42.5392 33.4857C42.951 34.2369 43.4365 34.9457 43.9885 35.6018C44.5272 36.2182 45.1239 36.7819 45.7705 37.2851C46.3773 37.7373 47.0216 38.1374 47.6965 38.4811C48.4024 38.8271 49.1311 39.1251 49.8774 39.3731C51.4394 39.8694 53.0445 40.2191 54.6719 40.4178C58.0051 40.8496 61.4693 40.9127 64.9535 41.0408L64.9739 41.0415C65.4104 41.0575 65.8249 41.2363 66.1352 41.5424C66.4455 41.8484 66.6289 42.2595 66.6491 42.6939C66.6692 43.1283 66.5246 43.5544 66.2439 43.8876C65.9633 44.2209 65.5671 44.4369 65.1339 44.4929C62.4886 44.8347 59.8857 45.1923 57.3843 45.7726C54.8932 46.3654 52.4809 47.1424 50.3507 48.3619C49.442 48.8786 48.584 49.4791 47.7879 50.1553C46.9968 50.8468 46.2721 51.6102 45.6231 52.4355C44.3276 54.1422 43.3092 56.0407 42.6049 58.0618C41.8841 60.1126 41.4191 62.2438 41.2204 64.4075C41.0138 66.6068 40.9679 68.8182 41.0831 71.0242C41.1755 73.1717 41.3949 75.3319 41.6494 77.4998L41.651 77.5142C41.6966 77.903 41.5855 78.2939 41.342 78.6013C41.0985 78.9086 40.7426 79.1073 40.3522 79.1538C39.9618 79.2002 39.5688 79.0907 39.2595 78.8492C38.9501 78.6076 38.7495 78.2538 38.7017 77.8652C38.2743 74.3833 37.8231 70.9312 37.0147 67.6033C36.6349 65.9471 36.1496 64.3165 35.5617 62.7216C34.9748 61.155 34.2412 59.6469 33.3704 58.2171C33.1419 57.8715 32.9297 57.513 32.6893 57.1763L31.9464 56.1824C31.4239 55.5429 30.8682 54.931 30.2816 54.3492C29.0676 53.1908 27.7372 52.1598 26.3114 51.2724C25.5934 50.8185 24.8533 50.3906 24.0972 49.9827C23.7193 49.7789 23.3377 49.5797 22.9524 49.3852L22.3721 49.0962L22.082 48.9545L21.8064 48.8317C21.4469 48.6595 21.0524 48.5202 20.6691 48.3694C20.2704 48.2401 19.8806 48.0931 19.4712 47.9816C18.6655 47.7321 17.8334 47.5428 17.0019 47.3634C15.3892 47.0286 13.7529 46.8183 12.1077 46.7342C10.5131 46.6561 8.93952 46.7495 7.63173 47.2003L7.25583 45.7115L7.25461 45.6131H7.25611H7.26531H7.27762H7.30226L7.35152 45.6134C7.38349 45.614 7.41622 45.6147 7.46224 45.6125L7.71672 45.6042L8.23433 45.5829C8.58151 45.5674 8.92671 45.552 9.26993 45.5368C9.95906 45.5095 10.6398 45.4825 11.3121 45.4559C12.6589 45.4074 13.9737 45.3784 15.2584 45.3514C15.6955 45.335 16.1332 45.352 16.5677 45.4022C16.7362 45.4157 16.8369 45.4662 16.9923 45.4657C17.0935 45.4629 17.1931 45.4909 17.2779 45.546L17.5329 45.2497C17.4968 45.3849 17.4469 45.4445 17.4707 45.4567C17.487 45.4688 17.5755 45.4305 17.6565 45.3012C17.6663 45.2856 17.6725 45.2681 17.6747 45.2499C17.6769 45.2317 17.675 45.2132 17.6692 45.1958C17.6633 45.1783 17.6537 45.1624 17.641 45.1491C17.6283 45.1359 17.6128 45.1256 17.5956 45.1189C17.5784 45.1123 17.5599 45.1096 17.5415 45.1109C17.5231 45.1122 17.5053 45.1176 17.4892 45.1266C17.4732 45.1356 17.4593 45.148 17.4486 45.163C17.4379 45.1779 17.4307 45.195 17.4275 45.2131L17.348 45.6599C17.3332 45.7425 17.2212 45.8687 17.0131 46.0091C16.8687 46.1263 16.7114 46.2268 16.5442 46.3088C16.0291 46.5596 15.4857 46.7485 14.9257 46.8713C13.7125 47.1491 12.4906 47.3947 11.2506 47.6283C10.6309 47.7446 10.007 47.8565 9.37874 47.9641L8.4279 48.121L7.93926 48.1955L7.68492 48.2314C7.58937 48.2439 7.44652 48.2566 7.3291 48.2667C6.90843 48.3027 6.48835 48.1912 6.14164 47.9513C5.79492 47.7114 5.54342 47.3583 5.4307 46.9531C5.31798 46.548 5.35116 46.1164 5.52448 45.7331C5.6978 45.3497 6.00034 45.0389 6.37968 44.8543L6.50096 44.7961C7.47808 44.3434 8.516 44.0341 9.58229 43.8781C10.0762 43.8185 10.58 43.7416 11.0643 43.724C11.3083 43.7107 11.5547 43.6909 11.797 43.6846L12.5202 43.6788C14.4393 43.6977 16.3509 43.9201 18.2226 44.3423C19.1684 44.5455 20.1034 44.7957 21.024 45.0919L21.7223 45.324L22.4236 45.5897C22.6556 45.6722 22.8944 45.7843 23.1302 45.8863L23.4841 46.0424L23.7995 46.1938C23.8177 46.1801 23.8348 46.1675 23.8555 46.1544Z'
        fill={fill}
      />
      <path
        d='M106.773 54.211C108.4 56.1524 109.711 58.335 110.66 60.6798C110.776 60.9734 110.902 61.2628 111.009 61.5596L111.294 62.464C111.385 62.7667 111.492 63.0639 111.568 63.3707L111.777 64.2964C111.841 64.6061 111.927 64.9102 111.97 65.2241L112.1 66.165L112.163 66.635C112.185 66.7902 112.206 66.9469 112.217 67.1194C112.242 67.4576 112.255 67.807 112.247 68.1708C112.238 68.8246 112.131 69.4734 111.93 70.0959C111.805 70.4585 111.638 70.8053 111.431 71.1292C111.202 71.4745 110.924 71.7851 110.605 72.0516L110.583 72.0705C110.319 72.2907 109.995 72.4265 109.653 72.4599C109.31 72.4933 108.966 72.4229 108.664 72.2578C108.363 72.0927 108.118 71.8407 107.963 71.5349C107.808 71.2291 107.75 70.8837 107.795 70.5442C108.009 68.9713 108.312 67.4117 108.703 65.873C109.339 63.3005 110.325 60.8264 111.633 58.5193C112.973 56.1605 114.725 54.0583 116.806 52.3112C118.937 50.5586 121.397 49.2474 124.044 48.4546C126.762 47.6498 129.636 47.5153 132.419 48.0626C132.828 48.1466 133.2 48.3549 133.485 48.6587C133.769 48.9626 133.952 49.3469 134.008 49.7587C134.063 50.1704 133.989 50.5892 133.795 50.9572C133.602 51.3252 133.298 51.6242 132.926 51.8128L132.889 51.8312C131.984 52.2767 131.013 52.5775 130.014 52.7225C129.095 52.8508 128.166 52.8877 127.239 52.8326C126.351 52.7888 125.506 52.684 124.693 52.5679C123.882 52.4492 123.108 52.3338 122.269 52.1811C121.061 51.9788 119.879 51.6459 118.743 51.1883C118.122 50.9286 117.527 50.6085 116.969 50.2329C116.399 49.8454 115.873 49.3976 115.399 48.8973C114.521 47.9386 113.803 46.8452 113.273 45.6593C112.782 44.5637 112.397 43.4242 112.123 42.2562C111.015 37.7299 111.109 32.9947 112.394 28.5153L112.396 28.5087C112.509 28.1183 112.733 27.7692 113.043 27.5044C113.352 27.2396 113.732 27.0706 114.137 27.0183C114.541 26.966 114.952 27.0327 115.319 27.2101C115.686 27.3875 115.993 27.6679 116.202 28.0167C116.857 29.1498 117.212 30.4302 117.232 31.7374C117.254 32.8834 117.111 34.0265 116.809 35.1325C116.676 35.6662 116.503 36.1596 116.338 36.6583C116.154 37.1502 115.974 37.6446 115.756 38.1216C115.339 39.0831 114.85 40.012 114.293 40.9004C112.08 44.4886 108.871 47.3627 105.054 49.1764C102.626 50.3097 99.989 50.9323 97.3083 51.0054C96.2565 51.0417 95.2062 50.8981 94.2031 50.5808C93.9997 50.5129 93.8095 50.443 93.632 50.3693C93.4551 50.2883 93.2909 50.2056 93.1392 50.1212C92.8617 49.9734 92.6034 49.7922 92.3704 49.5815C91.7574 49.0316 91.8738 48.5889 92.4827 48.2994C93.094 48.0162 94.1984 47.8666 95.6988 47.7167L96.4177 47.6394L97.1451 47.5426C97.6318 47.4687 98.1251 47.4071 98.6163 47.3154C99.597 47.1428 100.566 46.9121 101.519 46.6244C103.359 46.0549 105.085 45.1736 106.623 44.0194C109.732 41.6932 111.989 38.4176 113.051 34.6932C113.305 33.8446 113.433 32.9639 113.433 32.0786C113.444 31.348 113.247 30.6291 112.865 30.0054L116.134 29.5773C115.801 30.895 115.593 32.2408 115.513 33.5972C115.357 36.1015 115.7 38.6765 116.133 41.0426C116.433 42.7288 116.959 44.325 117.812 45.5522C118.215 46.1423 118.724 46.6521 119.315 47.0555C119.959 47.4632 120.661 47.773 121.397 47.9745C122.236 48.2055 123.089 48.3859 123.95 48.5148C124.868 48.6624 125.781 48.8107 126.64 48.898C128.369 49.0833 129.962 49.013 131.179 48.419L131.6 51.7883L130.996 51.6742L130.695 51.6149L130.389 51.579L129.776 51.5052L129.158 51.4742C127.752 51.421 126.346 51.585 124.991 51.9604C123.61 52.346 122.287 52.9105 121.055 53.6394C119.814 54.3695 118.67 55.2495 117.646 56.2594C116.613 57.2847 115.695 58.4191 114.91 59.6427C112.752 62.9621 111.479 66.8928 110.951 70.91L108.563 69.6293C108.705 69.5099 108.813 69.3547 108.875 69.1798C108.974 68.9075 109.031 68.6216 109.043 68.3321C109.062 67.9724 109.052 67.6118 109.014 67.2536L108.843 66.0552C108.784 65.655 108.703 65.2584 108.599 64.8672L108.462 64.2748C108.421 64.0761 108.343 63.8871 108.285 63.6924C108.156 63.3074 108.046 62.9152 107.903 62.5342L107.434 61.4041C106.755 59.9108 105.91 58.4977 104.916 57.191C103.898 55.893 102.746 54.705 101.479 53.6466C99.8791 52.344 98.1375 51.224 96.287 50.3075C96.1758 50.2495 96.0664 50.187 95.9544 50.1321L95.6131 49.9826L94.9348 49.6769C94.4894 49.4517 94.0256 49.3022 93.5709 49.1201L92.8896 48.8492C92.6665 48.7694 92.4454 48.6974 92.2231 48.6413C91.7837 48.5052 91.3135 48.5032 90.8731 48.6356C90.7653 48.6766 90.6673 48.727 90.5899 48.7619C90.5883 48.7626 90.5868 48.7636 90.5856 48.7649C90.5844 48.7662 90.5835 48.7677 90.5828 48.7693L90.5739 48.7942C90.5448 48.8845 90.551 48.9824 90.5914 49.0683C90.6279 49.1471 90.6801 49.2177 90.745 49.2756C90.8622 49.3799 91.0088 49.4456 91.1649 49.4639C91.2387 49.4737 91.3137 49.468 91.3851 49.4469C91.4489 49.4347 91.5118 49.4178 91.5731 49.3964C91.6765 49.3575 91.7519 49.333 91.7947 49.3604C91.8361 49.386 91.8484 49.467 91.7874 49.6051C91.7427 49.6895 91.6832 49.7653 91.6118 49.829C91.526 49.9311 91.4143 50.0085 91.2883 50.0532C90.9862 50.1749 90.6505 50.1858 90.3411 50.0838C90.1123 50.0083 89.907 49.8752 89.7451 49.6974C89.6289 49.5683 89.5372 49.4194 89.4745 49.2577C89.4026 49.066 89.37 48.862 89.3787 48.6575C89.3846 48.5024 89.4353 48.3523 89.5247 48.2251L89.749 47.9051C89.8665 47.7368 90.0043 47.5834 90.1592 47.4484C90.2456 47.3732 90.3373 47.3044 90.4338 47.2424C90.5365 47.1849 90.6431 47.1345 90.7528 47.0916C91.2713 46.8955 91.8228 46.8005 92.3773 46.8117C92.8106 46.8136 93.2429 46.8514 93.6699 46.9247L94.8439 47.1108L95.1392 47.1613L95.4286 47.2341L96.0095 47.3832C97.5753 47.7885 99.0875 48.3769 100.514 49.136C102.871 50.4498 104.971 52.1764 106.712 54.2327C106.732 54.2255 106.75 54.219 106.773 54.211Z'
        fill={fill}
      />
      <path
        d='M70.2207 95.9247L71.4573 96.6139L72.6472 97.3823L72.9433 97.5761L73.2274 97.788L73.7947 98.2128C73.9825 98.3557 74.1741 98.4938 74.3584 98.6412L74.8957 99.1044C75.6144 99.719 76.2979 100.373 76.9429 101.064L77.8703 102.136C78.174 102.496 78.4416 102.885 78.7273 103.259C79.8232 104.781 80.7523 106.415 81.4989 108.134C82.2212 109.85 82.7686 111.635 83.1328 113.461C83.2158 113.946 83.317 114.428 83.3798 114.917L83.5432 116.385L83.6153 117.862C83.6407 118.354 83.6082 118.848 83.6067 119.34C83.5423 121.314 83.26 123.274 82.7648 125.187L82.3776 126.532C82.2662 126.919 82.0183 127.252 81.6796 127.471C81.3408 127.69 80.934 127.78 80.534 127.724C80.134 127.668 79.7678 127.47 79.5027 127.167C79.2376 126.863 79.0915 126.475 79.0914 126.073L79.0919 125.995C79.0957 121.653 79.0864 117.176 79.9245 112.679C80.3364 110.402 81.0103 108.181 81.9329 106.058C82.8753 103.877 84.1674 101.862 85.7586 100.093C87.3907 98.3411 89.3082 96.876 91.4302 95.7594C93.4897 94.689 95.6561 93.8365 97.8942 93.2159C98.9944 92.9031 100.097 92.6357 101.204 92.3993C102.314 92.1657 103.451 91.9599 104.625 91.8322C105.825 91.6909 107.036 91.6552 108.242 91.7255C109.508 91.7998 110.758 92.0353 111.964 92.4263C112.361 92.5552 112.708 92.8031 112.959 93.136C113.209 93.469 113.351 93.8707 113.363 94.2865C113.376 94.7023 113.259 95.1118 113.029 95.4591C112.799 95.8065 112.467 96.0747 112.079 96.2272L112.035 96.244C110.137 96.9473 108.13 97.3149 106.105 97.3302C103.956 97.3432 101.81 97.1733 99.6904 96.8224C97.5887 96.532 95.5079 96.1076 93.4608 95.5519C92.4028 95.2601 91.3638 94.9043 90.3494 94.4864C89.3046 94.0643 88.2965 93.5573 87.3353 92.9706C86.3493 92.3714 85.4239 91.6786 84.5721 90.9018C83.7248 90.1205 82.9577 89.2572 82.2822 88.3245C80.998 86.5217 79.9553 84.56 79.1805 82.4888C77.6575 78.5098 76.7167 74.3336 76.387 70.0881C76.3484 69.5587 76.3153 69.0287 76.297 68.498C76.2851 68.2329 76.2765 67.9675 76.2732 67.7021C76.269 67.4343 76.2593 67.1865 76.2648 66.8609C76.2647 66.1458 76.3709 65.4345 76.58 64.7504C76.7233 64.2982 76.9373 63.8714 77.2141 63.4857C77.5448 63.0296 77.9722 62.6516 78.4662 62.3785L78.4871 62.3671C78.7288 62.2358 78.9941 62.1533 79.2679 62.1241C79.5416 62.095 79.8184 62.1198 80.0825 62.1972C80.3466 62.2745 80.5929 62.403 80.8071 62.5751C81.0214 62.7472 81.1995 62.9596 81.3313 63.2003C81.4728 63.461 81.558 63.7483 81.5814 64.0438C82.1998 72.5023 80.007 80.9286 75.3408 88.0239C74.2544 89.6725 72.9666 91.1804 71.507 92.5131C70.7596 93.1857 69.9589 93.7972 69.1128 94.3416C68.2631 94.8888 67.3642 95.3561 66.4277 95.7378C64.9425 96.3656 63.334 96.6513 61.7223 96.5737C60.6891 96.5357 59.6803 96.2507 58.7809 95.743C57.8134 95.1296 58.005 94.7061 58.8476 94.5088C59.276 94.3857 59.8746 94.3094 60.6265 94.1665C61.5351 93.9978 62.4317 93.7706 63.3107 93.4861C64.66 93.032 65.9357 92.3846 67.0974 91.5642C68.3062 90.7024 69.4104 89.7037 70.3879 88.5883C71.7991 86.9575 73.0106 85.1655 73.9969 83.25C75.0191 81.327 75.8494 79.3087 76.4759 77.2243C77.7378 73.0547 78.1895 68.6838 77.8067 64.3457L80.2994 65.6782C80.3001 65.6796 80.3037 65.6848 80.3001 65.6789L80.2906 65.6655C80.2923 65.6683 80.2941 65.6709 80.2962 65.6733C80.3013 65.6799 80.3062 65.6845 80.3035 65.6811V65.6862C80.2892 65.7064 80.2773 65.7282 80.2679 65.7511C80.203 65.9037 80.161 66.065 80.1433 66.2298C80.1103 66.4882 80.0972 66.7488 80.1042 67.0092L80.141 67.9958C80.2097 69.3371 80.3523 70.6732 80.5475 71.9999C80.9487 74.6493 81.6196 77.2511 82.55 79.7652C83.1924 81.5508 84.0306 83.2604 85.0493 84.8631C85.5357 85.6166 86.081 86.3306 86.6801 86.9988C86.9684 87.3204 87.2728 87.6274 87.5921 87.9185C87.7533 88.0607 87.9036 88.213 88.0689 88.3498L88.5649 88.7589C90.0512 89.8928 91.7168 90.7723 93.4935 91.3611C95.3729 91.9938 97.3023 92.4684 99.2615 92.7801C101.225 93.1434 103.211 93.3703 105.205 93.459C107.058 93.5483 108.911 93.2808 110.662 92.6712L110.725 96.0477C108.991 95.4608 107.033 95.3647 105.022 95.5663C104.017 95.6609 102.995 95.8267 101.964 96.0244C100.93 96.2253 99.9039 96.4513 98.895 96.7113C96.7336 97.2415 94.6481 98.0414 92.6881 99.0922C90.7831 100.11 89.0933 101.484 87.7112 103.139C86.3417 104.839 85.2598 106.749 84.5081 108.796C83.7333 110.891 83.1923 113.065 82.8947 115.278C82.395 118.763 82.3417 122.364 82.2954 126.013L79.3365 125.529C81.3075 119.744 80.62 113.077 77.6703 107.654C77.4774 107.32 77.3063 106.972 77.0964 106.648L76.4656 105.677C76.2512 105.356 76.0054 105.059 75.7773 104.747C75.6591 104.595 75.5499 104.435 75.4245 104.289L75.0438 103.854C74.5387 103.27 74.0044 102.713 73.4429 102.183C72.8538 101.682 72.2829 101.158 71.6447 100.714C71.3387 100.476 71.0207 100.253 70.6919 100.046C70.3629 99.8395 70.0417 99.6196 69.7065 99.4225L68.6831 98.8592C68.3444 98.6662 67.9803 98.5221 67.6304 98.3503C66.2113 97.693 64.7275 97.1843 63.2028 96.8325C59.5696 95.9832 55.7969 95.9102 52.1333 96.6183L52.095 95.1707C54.2888 95.8349 56.5916 96.0675 58.8747 95.8554C60.1706 95.7339 60.8285 95.6992 60.823 95.9768C60.8144 96.0994 60.6432 96.3119 60.2742 96.5539C60.0503 96.7006 59.816 96.8309 59.5732 96.9437C59.4313 97.0125 59.2765 97.0822 59.1074 97.1469C59.023 97.1792 58.9361 97.2165 58.8444 97.2458C58.752 97.2726 58.6565 97.2989 58.5579 97.3249C56.2681 97.9237 53.876 98.0268 51.5428 97.6271C51.1566 97.5597 50.8042 97.3655 50.5417 97.0756C50.2792 96.7856 50.1217 96.4166 50.0942 96.0272C50.0668 95.6378 50.171 95.2505 50.3902 94.9269C50.6095 94.6033 50.9312 94.3621 51.3041 94.2416L51.4521 94.1944C53.77 93.4586 56.1885 93.0854 58.6214 93.0881C60.6192 93.0823 62.6092 93.3357 64.5412 93.8418C66.4865 94.343 68.3712 95.0538 70.1619 95.9615C70.1808 95.9484 70.1988 95.9367 70.2207 95.9247Z'
        fill={fill}
      />
    </svg>
  );
};

export default NewsletterStars;
