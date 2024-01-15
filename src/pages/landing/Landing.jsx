import React, { useEffect, useRef } from 'react'
import logoSVG from './assets/svg/meta_logo_svg_white.svg'
import homeSVG from './assets/svg/home.svg'
import phoneSVG from './assets/svg/phone.svg'
import personSVG from './assets/svg/person.svg'
import styles from './style.module.scss';
import { Link } from 'react-router-dom'

const Landing = () => {
    const interBubbleRef = useRef(null);

    useEffect(() => {
        let curX = 0;
        let curY = 0;
        let tgX = 0;
        let tgY = 0;

        function move() {
            curX += (tgX - curX) / 5;
            curY += (tgY - curY) / 5;
            if (interBubbleRef.current) {
                const interBubble = interBubbleRef.current;
                interBubble.style.transform = `translate(${Math.round(
                    curX
                )}px, ${Math.round(curY)}px)`;

            }
            requestAnimationFrame(() => {
                move();
            });
        }

        window.addEventListener('mousemove', (event) => {
            tgX = event.clientX;
            tgY = event.clientY;
        });

        move();

        return () => {
            window.removeEventListener('mousemove', (event) => {
                tgX = event.clientX;
                tgY = event.clientY;
            });
        };
    }, [])



    return (
        <div className='bg-black w-full h-screen'>
            <nav className="absolute bg-transparent z-50 w-full mt-[3vw]">
                <div className="w-[90vw] lg:w-[80vw] 2xl:w-[70vw] mx-auto flex py-4 justify-between">
                    <ul className="flex items-center justify-center text-white gap-10 box-border">
                        <li className="">
                            <img
                                className="m-auto"
                                width="150px"
                                src={logoSVG}
                                alt="site-logo"
                            />
                        </li>
                        <li className="hidden lg:block">
                            <a className="nav-button" href="#">
                                <span>صفحه اول</span>
                            </a>
                        </li>
                        <li className="hidden lg:block">
                            <a className="nav-button" href="#">
                                <span>صفحه دوم</span>
                            </a>
                        </li>
                        <li className="hidden lg:block">
                            <a className="nav-button" href="#">
                                <span>صفحه سوم</span>
                            </a>
                        </li>
                    </ul>
                    <div>
                        <ul className="flex gap-3 md:gap-5">
                            <li className="nav-button2">
                                <a href="">
                                    <img width="20px" src={homeSVG} alt="" />
                                </a>
                            </li>
                            <li className="nav-button2">
                                <a href="">
                                    <img width="20px" src={phoneSVG} alt="" />
                                </a>
                            </li>
                            <li className="nav-button2">
                                <a href="">
                                    <img width="20px" src={personSVG} alt="" />
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <div className="absolute w-[100vw] h-[100vh] flex flex-col justify-center items-center z-40 gap-8">
                <div className="flex flex-col items-center text-white justify-center">
                    <p className="text-[25vw] sm:text-[10rem] mb-[-18px] sm:mb-[-26px]">
                        Jamshid
                    </p>
                    <p className="text-[6vw] sm:text-[2.5rem]">پلتفرم بازی های دورهمی</p>
                </div>
                <div className="border-[3px] border-[#FFFFFF90] rounded-2xl flex pt-1 mt-5 text-white backdrop-blur">
                    <div className="text-2xl px-10 pb-3 hover:font-bold hover:translate-y-[-2px] transition-all">
                        <Link to={'/mafia/profile'}>ورود</Link>
                    </div>
                    <div className="width:3px h-[60%] border-2 my-auto rounded border-[#FFFFFF90]" />
                    <div className="text-2xl px-10 pb-3 hover:font-bold hover:translate-y-[-2px] transition-all">
                        <Link to={'/mafia/profile'}>ثبت نام</Link>
                    </div>
                </div>
            </div>
            <div className={styles.gradient_bg}>
                <svg xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <filter id="goo">
                            <feGaussianBlur in="SourceGraphic" stdDeviation={10} result="blur" />
                            <feColorMatrix
                                in="blur"
                                mode="matrix"
                                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
                                result="goo"
                            />
                            <feBlend in="SourceGraphic" in2="goo" />
                        </filter>
                    </defs>
                </svg>
                <div className={styles.gradients_container}>
                    <div className={styles.g1} />
                    <div className={styles.g2} />
                    <div className={styles.g3} />
                    <div className={styles.g4} />
                    <div className={styles.g5} />
                    <div className={styles.interactive} ref={interBubbleRef}
                    />
                </div>
            </div>
        </div>
    )
}

export default Landing