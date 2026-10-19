import './styles/tokens.css';
import './styles/main.css';
import './styles/board.css';
import { mountApp } from './app/app';

const root = document.getElementById('app');
if (root) mountApp(root);
