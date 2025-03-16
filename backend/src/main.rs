use warp::Filter;
use warp::ws::{Message, WebSocket};
use tokio::sync::mpsc;
use futures::{StreamExt, SinkExt};


#[tokio::main]
async fn main() {
    // Define the WebSocket route
    let ws_route = warp::path("ws")
        .and(warp::ws())
        .map(|ws: warp::ws::Ws| {
            ws.on_upgrade(handle_connection)
        });

    // Start the server
    let addr = ([127, 0, 0, 1], 3030);
    println!("WebSocket server running at ws://{}:{}", addr.0[0], addr.1);
    warp::serve(ws_route).run(addr).await;
}

// Handle WebSocket connections
async fn handle_connection(ws: WebSocket) {
    let (mut ws_tx, mut ws_rx) = ws.split();
    let (tx, mut rx) = mpsc::unbounded_channel::<String>();

    // Spawn a task to forward messages from the client
    tokio::spawn(async move {
        while let Some(result) = ws_rx.next().await {
            if let Ok(msg) = result {
                if msg.is_text() {
                    let text = msg.to_str().unwrap().to_string();
                    println!("Received: {}", text);
                    


                    tx.send(format!("Echo: {}", text)).unwrap();
                }
            }
        }
    });

    // Spawn a task to send messages to the client
    tokio::spawn(async move {
        while let Some(msg) = rx.recv().await {
            if ws_tx.send(Message::text(msg)).await.is_err() {
                break;
            }
        }
    });
}
