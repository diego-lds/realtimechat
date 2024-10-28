import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import defaultProfilePic from "../assets/no-user.svg"; // Imagem de perfil padrão

function ChatBalloon({
  message,
  senderName,
  photoURL,
  isOwnMessage,
  timestamp,
}) {
  return (
    <div
      className={`flex items-start ${
        isOwnMessage ? "justify-end" : "justify-start"
      } mb-4`}
    >
      {!isOwnMessage && (
        <img
          src={photoURL || defaultProfilePic}
          alt={`${senderName} profile`}
          className="size-12 rounded-full mr-2 border-2 border-gray-300"
        />
      )}

      <div
        className={`max-w-xs px-4 py-2 rounded-lg shadow ${
          isOwnMessage ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-900"
        }`}
      >
        {/* Aplicando quebra de texto */}
        <p className="text-sm md:text-base break-words">{message}</p>{" "}
        {/* Quebra de palavra aplicada */}
        <p
          className={`text-xs mt-1 text-right ${
            isOwnMessage ? "text-white" : "text-gray-500"
          }`}
        >
          {moment(timestamp).format("HH:mm")}
        </p>
      </div>

      {/* Foto de perfil para mensagens do próprio usuário (à direita) */}
      {isOwnMessage && (
        <img
          src={photoURL || defaultProfilePic}
          alt="Sua foto de perfil"
          className="size-12 rounded-full ml-2"
        />
      )}
    </div>
  );
}

ChatBalloon.propTypes = {
  message: PropTypes.string.isRequired,
  senderName: PropTypes.string,
  photoURL: PropTypes.string,
  isOwnMessage: PropTypes.bool,
  timestamp: PropTypes.instanceOf(Date).isRequired,
};

ChatBalloon.defaultProps = {
  senderName: "Desconhecido",
  photoURL: defaultProfilePic,
  isOwnMessage: false,
};

export default ChatBalloon;
