import React, { useState } from "react";
import fieldImage from "../img/field.png"; // サッカーのフィールド画像をインポート

type Player = {
  id: number;
  name: string;
  x: number; // X座標
  y: number; // Y座標
  color: string; // プレイヤーの色
};

const LiveTactics = () => {
  const [players, setPlayers] = useState<Player[]>([
    { id: 1, name: "Player 1", x: 100, y: 100, color: "red" },
    { id: 2, name: "Player 2", x: 200, y: 200, color: "blue" },
  ]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>, id: number) => {
    const newX = e.clientX - e.currentTarget.offsetParent!.getBoundingClientRect().left;
    const newY = e.clientY - e.currentTarget.offsetParent!.getBoundingClientRect().top;

    setPlayers((prevPlayers) =>
      prevPlayers.map((player) =>
        player.id === id ? { ...player, x: newX, y: newY } : player
      )
    );
  };

  const addPlayer = () => {
    const newPlayer: Player = {
      id: players.length + 1,
      name: `Player ${players.length + 1}`,
      x: 150,
      y: 150,
      color: "green",
    };
    setPlayers([...players, newPlayer]);
  };

  return (
    <div className="flex h-screen">
      {/* 左側のサイドバー */}
      <div className="w-1/5 bg-gray-800 text-white p-4">
        <h2 className="text-lg font-bold mb-4">Players</h2>
        <ul>
          {players.map((player) => (
            <li
              key={player.id}
              className="mb-2 cursor-pointer"
              onClick={() => setSelectedPlayer(player)}
            >
              {player.name}
            </li>
          ))}
        </ul>
        <button
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={addPlayer}
        >
          Add Player
        </button>
      </div>

      {/* 中央のフィールド */}
      <div
        className="relative flex-1 bg-base-100"
        style={{
          backgroundImage: `url(${fieldImage})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        {players.map((player) => (
          <div
            key={player.id}
            className="absolute font-bold rounded-full flex items-center justify-center cursor-pointer"
            style={{
              width: "50px",
              height: "50px",
              backgroundColor: player.color,
              color: "white",
              top: `${player.y}px`,
              left: `${player.x}px`,
              transform: "translate(-50%, -50%)",
            }}
            draggable
            onDragEnd={(e) => handleDrag(e, player.id)}
          >
            {player.name}
          </div>
        ))}
      </div>

      {/* 右側のサイドバー */}
      <div className="w-1/5 bg-gray-800 text-white p-4">
        <h2 className="text-lg font-bold mb-4">Settings</h2>
        {selectedPlayer ? (
          <div>
            <p className="mb-2">Name: {selectedPlayer.name}</p>
            <label className="block mb-2">
              Color:
              <input
                type="color"
                value={selectedPlayer.color}
                onChange={(e) =>
                  setPlayers((prevPlayers) =>
                    prevPlayers.map((player) =>
                      player.id === selectedPlayer.id
                        ? { ...player, color: e.target.value }
                        : player
                    )
                  )
                }
                className="ml-2"
              />
            </label>
          </div>
        ) : (
          <p>Select a player to edit</p>
        )}
      </div>
    </div>
  );
};

export default LiveTactics;