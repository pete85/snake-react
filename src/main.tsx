import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.scss';
import {library} from '@fortawesome/fontawesome-svg-core';
import {
    faArrowRightFromBracket,
    faArrowRightToBracket,
    faChartLine,
    faHome,
    faServer,
    faSprayCan
} from '@fortawesome/free-solid-svg-icons';
import {faGithub, faVuejs} from "@fortawesome/free-brands-svg-icons";

library.add(faHome);
library.add(faArrowRightFromBracket);
library.add(faArrowRightToBracket);
library.add(faGithub);
library.add(faServer);
library.add(faSprayCan);
library.add(faVuejs);
library.add(faChartLine);

createRoot(document.getElementById('root')!).render(
    <App />
)
