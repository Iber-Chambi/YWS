import { useState } from 'react';
let restablecer = 0;
let inScanner = 1;

export const useYWs:(url:string)=>{
	wwss:WebSocket|null,
	isCon:boolean,
	conectWs:()=>void
} = (url:string) => {
	
	const [wwss, setWs] = useState<any>(null);
	const [isCon, setIsCon] = useState(false);

	const conectWs = async () => {
		// const wsUrl2 = localStorage.getItem('wsUrl');
		const wsUrl2 = url;
		try {
			setWs(await conection(wsUrl2));
		} catch (error) {
			console.log('error: ', error)
			if (inScanner) {
				reconectionWs(wsUrl2);
			}
			desconectionWs(wsUrl2);
		}
	};

	const conection = (wsUrl2:any) => {
		console.log('conection ws: ', wsUrl2)
		return new Promise((resolve, reject) => {
			const websock = new WebSocket(wsUrl2);
			console.log("se intenta la conexion");
			websock.onopen = () => {
				console.log("conectado");
				setIsCon(true);
				listenWs(websock);
				resolve(websock);
			};
			websock.onclose = () => {
				websock ? websock.close() : '';
				reject("desconectado");
			};
		});
	};

	const desconectionWs = (wsUrl2:any) => {
		console.log("desconectado");
		if (inScanner) {
			restablecer = 0;
			reconectionWs(wsUrl2);
		} else {
			restablecer = 1;
		}
		setIsCon(false);
	};
	
	const reconectionWs = async (wsUrl2:any) => {
		let retryInterval = 400;
		const maxRetryInterval = 10 * 60 * 1000;
		let startTime = Date.now();
		let cont = 2;
		while (!restablecer) {
			try {
				setWs(await conection(wsUrl2));
				restablecer = 1;
			} catch (error) {
				if (!inScanner) {
					restablecer = 1;
					console.log("back ya no se intenta la conexion")
					return;
				};
				const elapsedTime = Date.now() - startTime;
				if (elapsedTime > cont * 60 * 1000) {
					retryInterval = (cont / 4) * 60 * 1000;
					cont = cont + 2;
				}
				if (retryInterval > maxRetryInterval) {
					retryInterval = maxRetryInterval;
				}
				await new Promise((resolve) => setTimeout(resolve, retryInterval)); // loop time
			}
		}
	};

	const listenWs = async (ws:any) => {
		const websocket = ws;
		// const wsUrl2 = localStorage.getItem('wsUrl');
		const wsUrl2 = url;
		// websocket.addEventListener("message", (event:any) => {
		// 	console.log("message: ", event.data);
		// });
		websocket.addEventListener("close", () => {
			websocket ? websocket.close() : '';
			if (inScanner) {
				restablecer = 0;
			} else {
				restablecer = 1;
			}
			reconectionWs(wsUrl2);
			desconectionWs(null);
		});
	};

	return {
		wwss,
		isCon,
		conectWs,
	}
}

export default useYWs;
