const ws = new WebSocket('ws://localhost:9003')

ws.addEventListener('open', ({ target: s }) => {
    // client 連線成功後，發送訊息
    s.send('Hello from the client!')

    // 新增 message 事件監聽器
    s.addEventListener('message', ({ data }) => {
        console.log('Received:', data)
    })

    // 新增 close 事件監聽器
    s.addEventListener('close', () => {
        console.log('Connection closed')
    })
})