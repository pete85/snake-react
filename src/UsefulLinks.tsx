import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGithub, faReact} from "@fortawesome/free-brands-svg-icons";
import {faSprayCan} from "@fortawesome/free-solid-svg-icons";
import pete85_bulb from './assets/pete85_bulb.png';

const UsefulLinks: React.FC = () => {

    const handleRedirect = (link: string) => {
        window.open(link, '_blank');
    }

    return (
        <div className="tw-p-8 tw-flex tw-flex-wrap tw-justify-center tw-gap-5">
            <button onClick={() => handleRedirect('https://github.com/pete85/snake-react')}
                    className="tw-flex tw-items-center tw-justify-center tw-bg-blue-600 tw-text-white tw-px-4 tw-py-3 tw-gap-2 tw-rounded-lg">
                <FontAwesomeIcon icon={faGithub}/>
                <span>Github</span>
            </button>

            <button onClick={() => handleRedirect('https://pete85.com')}
                    className="tw-flex tw-items-center tw-justify-center tw-bg-blue-600 tw-text-white tw-py-3 tw-px-4 tw-gap-2 tw-rounded-lg">
                <img alt="pete85 logo" className="tw-w-5" src={pete85_bulb}/>
                <span>pete85</span>
            </button>

            <button onClick={() => handleRedirect('https://react.dev/')}
                    className="tw-flex tw-items-center tw-justify-center tw-bg-blue-600 tw-text-white tw-px-4 tw-py-3 tw-gap-2 tw-rounded-lg">
                <FontAwesomeIcon icon={faReact}/>
                <span>React</span>
            </button>

            <button onClick={() => handleRedirect('https://tailwindcss.com/')}
                    className="tw-flex tw-items-center tw-justify-center tw-bg-blue-600 tw-text-white tw-px-4 tw-py-3 tw-gap-2 tw-rounded-lg">
                <FontAwesomeIcon icon={faSprayCan}/>
                <span>Tailwind</span>
            </button>
        </div>
    )
}

export default UsefulLinks;