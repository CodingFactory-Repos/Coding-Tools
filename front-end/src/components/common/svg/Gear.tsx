const Gear = ({className = '', size = '24px', color = 'fill-[#666666]'}) => (
	<svg class={color + className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path fill-rule="evenodd" clip-rule="evenodd" d="M13.7881 3.80439C13.3321 1.93239 10.6681 1.93239 10.2121 3.80439C10.144 4.08569 10.0105 4.34694 9.82236 4.56688C9.63424 4.78683 9.39685 4.95925 9.1295 5.07011C8.86216 5.18098 8.57242 5.22716 8.28386 5.2049C7.99529 5.18263 7.71606 5.09255 7.46889 4.94199C5.82249 3.93879 3.93849 5.82279 4.94169 7.46919C5.58969 8.53239 5.01489 9.91959 3.80529 10.2136C1.93209 10.6684 1.93209 13.3336 3.80529 13.7872C4.08666 13.8554 4.34796 13.989 4.5679 14.1773C4.78785 14.3655 4.96022 14.6031 5.07098 14.8706C5.18174 15.1381 5.22776 15.4279 5.20529 15.7166C5.18283 16.0052 5.09251 16.2845 4.94169 16.5316C3.93849 18.178 5.82249 20.062 7.46889 19.0588C7.71602 18.908 7.99527 18.8177 8.28391 18.7952C8.57255 18.7727 8.86242 18.8187 9.12991 18.9295C9.39739 19.0403 9.63494 19.2126 9.8232 19.4326C10.0115 19.6525 10.1451 19.9138 10.2133 20.1952C10.6681 22.0684 13.3333 22.0684 13.7869 20.1952C13.8553 19.914 13.9891 19.6528 14.1774 19.4331C14.3657 19.2133 14.6032 19.041 14.8706 18.9303C15.138 18.8195 15.4278 18.7735 15.7163 18.7958C16.0049 18.8181 16.2841 18.9082 16.5313 19.0588C18.1777 20.062 20.0617 18.178 19.0585 16.5316C18.9079 16.2844 18.8178 16.0052 18.7955 15.7166C18.7732 15.4281 18.8192 15.1383 18.93 14.8709C19.0407 14.6035 19.213 14.366 19.4328 14.1777C19.6525 13.9894 19.9137 13.8556 20.1949 13.7872C22.0681 13.3324 22.0681 10.6672 20.1949 10.2136C19.9135 10.1454 19.6522 10.0118 19.4323 9.8235C19.2123 9.63524 19.04 9.39769 18.9292 9.13021C18.8184 8.86272 18.7724 8.57285 18.7949 8.28421C18.8174 7.99557 18.9077 7.71632 19.0585 7.46919C20.0617 5.82279 18.1777 3.93879 16.5313 4.94199C16.2842 5.09281 16.0049 5.18313 15.7163 5.20559C15.4276 5.22806 15.1378 5.18204 14.8703 5.07128C14.6028 4.96052 14.3652 4.78815 14.177 4.5682C13.9887 4.34826 13.8551 4.08696 13.7869 3.80559L13.7881 3.80439ZM12.0001 15.6004C12.9549 15.6004 13.8705 15.2211 14.5457 14.546C15.2208 13.8708 15.6001 12.9552 15.6001 12.0004C15.6001 11.0456 15.2208 10.1299 14.5457 9.45481C13.8705 8.77967 12.9549 8.40039 12.0001 8.40039C11.0453 8.40039 10.1296 8.77967 9.45451 9.45481C8.77938 10.1299 8.40009 11.0456 8.40009 12.0004C8.40009 12.9552 8.77938 13.8708 9.45451 14.546C10.1296 15.2211 11.0453 15.6004 12.0001 15.6004V15.6004Z"/>
	</svg>
)

export default Gear;