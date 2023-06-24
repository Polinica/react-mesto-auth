import React from "react";
import { BrowserRouter, Route, Routes, Link, Navigate } from "react-router-dom";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import ConfirmActionPopup from "./ConfirmActionPopup";
import InfoPopup from "./InfoPopup";
import Register from "./Register";
import Login from "./Login";

import api from "../utils/Api";

import CurrentUserContext from "../contexts/CurrentUserContext";

function App() {
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
    React.useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
    React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isInfoPopupOpen, setIsInfoPopupOpen] = React.useState(false);

  const [selectedCard, setSelectedCard] = React.useState(null);
  const [toBeDeletedCard, setToBeDeletedCard] = React.useState(null);
  //const [isImagePopupOpen, setIsImagePopupOpen] = React.useState(false);

  const [currentUser, setCurrentUser] = React.useState({});

  const [cards, setCards] = React.useState([]);

  // Авторизация пользователя
  const [loggedIn, setLoggedIn] = React.useState(false);

  const [isLoading, setIsLoading] = React.useState(false);

  const isOpen =
    isEditAvatarPopupOpen ||
    isEditProfilePopupOpen ||
    isAddPlacePopupOpen ||
    selectedCard;

  React.useEffect(() => {
    api.getUserInfo().then(setCurrentUser).catch(console.error);
  }, []);

  React.useEffect(() => {
    api
      .getInitialCards()
      .then((res) => {
        setCards(res);
      })
      .catch(console.error);
  }, []);

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
    //setIsImagePopupOpen(true);
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard(null);
    //setIsImagePopupOpen(false);
    setToBeDeletedCard(null);
    setIsInfoPopupOpen(false);
  }

  function handleUpdateUser(userInfo) {
    api
      .setUserInfo(userInfo)
      .then((newUserInfo) => {
        setCurrentUser(newUserInfo);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleUpdateAvatar({ avatar }) {
    api
      .changeAvatar(avatar)
      .then((newUserInfo) => {
        setCurrentUser(newUserInfo);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleAddPlace(newPlaceData) {
    //const cardId = card._id;
    api
      .addNewCard(newPlaceData)
      .then((newCard) => {
        setCards((state) => [newCard, ...state]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleCardDelete(card) {
    setToBeDeletedCard(card);
  }

  function handleConfirmDelete() {
    const cardId = toBeDeletedCard._id;
    api
      .deleteCard(cardId)
      .then(() => {
        setCards((state) => state.filter((card) => card._id !== cardId));
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  React.useEffect(() => {
    function closeByEscape(evt) {
      if (evt.key === "Escape") {
        closeAllPopups();
      }
    }
    if (isOpen) {
      // навешиваем только при открытии
      document.addEventListener("keydown", closeByEscape);
      return () => {
        document.removeEventListener("keydown", closeByEscape);
      };
    }
  }, [isOpen]);

  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <CurrentUserContext.Provider value={currentUser}>
        <div className="content">
          <Routes>
            <Route
              path="/"
              element={
                loggedIn ? (
                  <Main
                    onEditProfile={handleEditProfileClick}
                    onAddPlace={handleAddPlaceClick}
                    onEditAvatar={handleEditAvatarClick}
                    onCardClick={handleCardClick}
                    cards={cards}
                    onCardLike={handleCardLike}
                    onCardDelete={handleCardDelete}
                  />
                ) : (
                  <Navigate to="/sign-in" />
                )
              }
            />

            <Route path="/sign-up" element={<Register />} />
            <Route path="/sign-in" element={<Login />} />
            <Route
              path="*"
              element={
                loggedIn ? <Navigate to="/" /> : <Navigate to="/sign-in" />
              }
            />
          </Routes>

          <Footer />

          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
          />

          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
          />

          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onAddPlace={handleAddPlace}
          />

          <ConfirmActionPopup
            isOpen={!!toBeDeletedCard}
            onClose={closeAllPopups}
            onConfirm={handleConfirmDelete}
          />

          <ImagePopup
            card={selectedCard}
            onClose={closeAllPopups}
            //isOpen={isImagePopupOpen}
          />

          <InfoPopup
            message="Успешно!"
            isSuccessful={true}
            isOpened={isInfoPopupOpen}
            onClose={closeAllPopups}
          />
        </div>
      </CurrentUserContext.Provider>
    </BrowserRouter>
  );
}

export default App;
