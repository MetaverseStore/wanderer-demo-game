import React from 'react';
import { RiCloseLine } from 'react-icons/ri';
import { BsFillShieldFill, BsFillHeartFill } from 'react-icons/bs';
import { GiRubberBoot, GiClover } from 'react-icons/gi';

const Controls = ({ setCharacterLoaded, attributes }: {
    setCharacterLoaded: React.Dispatch<React.SetStateAction<boolean>>,
    attributes: any
}) => {

    console.log(attributes);



    return (
        <>
            <div
                className="absolute top-0 right-0 p-4 m-4 bg-[#ffffffAA] bg-blend-lighten z-50 cursor-pointer rounded-lg"
                onClick={() => {
                    setCharacterLoaded(false);
                }}
            >
                <RiCloseLine
                    className="text-2xl"
                />
            </div>

            {attributes && (

                <div
                    className="absolute bottom-0 right-0 p-4 m-4 bg-[#ffffffAA] bg-blend-lighten z-50 rounded-lg"
                >
                    <div className='flex items-center  mt-2'>
                        <BsFillHeartFill />
                        <p className='font-bold ml-1'>
                            Health: {attributes.health}
                        </p>
                    </div>
                    <div className='flex items-center mt-2'>
                        <BsFillShieldFill />
                        <p className='font-bold ml-1'>
                            Defence: {attributes.defence}
                        </p>
                    </div>
                    <div className='flex items-center mt-2'>
                        <GiRubberBoot />
                        <p className='font-bold ml-1'>
                            Speed: {attributes.speed}
                        </p>
                    </div>
                    <div className='flex items-center mt-2'>
                        <GiClover />
                        <p className='font-bold ml-1'>
                            Evasion: {attributes.evasion}
                        </p>
                    </div>

                </div>
            )}

        </>
    )
}

export default Controls