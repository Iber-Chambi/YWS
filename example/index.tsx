import 'react-app-polyfill/ie11';
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { useYWs } from '../.';

const App = () => {
  const {conectWs,wwss,isCon} = useYWs('ws://localhost:3000/ws/c21895f0-3c29-4ec5-a9d0-6dd9a06a7e89');

	React.useEffect(() => {
		conectWs();
	}, [])

	React.useEffect(() => {
		listenWs(wwss);
		return () => {
			listenWs(wwss);
		}
	}, [wwss])

	const listenWs = async (wwss:any) => {
		wwss?wwss.addEventListener("message", (event:any) => {
			console.log("message: ", event.data);
		}):'';
		wwss?wwss.addEventListener("close", () => {
			console.log("close");
		}):'';
	}
	const reset = () => {
		wwss?.close();
	}
	const send = () => {
		wwss?.send(JSON.stringify({ type: 'message', data: 'hola' }));
	}

	
	return (
		<>
			<div className="bdp">
				try push npm
			</div>
			<button onClick={send}>
				{isCon ? 'Conectado' : 'Desconectado'}
			</button>
			<button onClick={reset}>
				reset
			</button>
		</>
	)
};

const rootElement = document.getElementById('root');
const root = createRoot(rootElement!);
root.render(<App />);
