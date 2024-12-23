# YWS
re try conexion ws every time

### Example
```
import { useEffect } from 'react';
import { useYWs } from './hooks/yws'

function App() {
	const {conectWs,wwss,isCon} = useYWs('ws://localhost:3000/ws/c21895f0-3c29-4ec5-a9d0-6dd9a06a7e89');

	useEffect(() => {
		conectWs();
	}, [])

	useEffect(() => {
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
		wwss.close();
	}
	const send = () => {
		wwss.send(JSON.stringify({ type: 'message', data: 'hola' }));
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
}

export default App

```