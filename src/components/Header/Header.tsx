import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRecoilState } from 'recoil';
import cuppingLogo from '../../assets/img/cupping-logo-word.svg';
import beniImg from '../../assets/img/beni.svg';
import logout from '../../assets/img/logout.png';
import { loginState } from '../../recoil/atom/loginState';
import { cardState } from '../../recoil/atom/cardState';

interface Card {
  id: number;
  beanImage: string;
  beanOriginName: string;
  beanName: string;
  hashTag: string;
}

const Header: React.FC = () => {
  const [loggined, setLoggedin] = useRecoilState(loginState);
  const [cards, setCards] = useRecoilState(cardState);
  const navigate = useNavigate();

  // 검색 결과 가져오기
  const getSearchResults = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BE_SERVER}/main/beans/search?keyword=`,
      );
      return data.data;
    } catch (err) {
      console.log('✨ ‣ getSearchResults ‣ err:', err);
    }
  };

  // 로고 버튼 눌렀을때 이벤트 처리
  const handleHomePage = async () => {
    try {
      const searchResults = await getSearchResults();
      setCards(searchResults);
      navigate('/');
    } catch (err) {
      console.log('✨ ‣ handleSearch ‣ err:', err);
    }
  };

  const handleSignupPage = () => {
    navigate('/signup');
  };

  const handleLoginPage = () => {
    navigate('/login');
  };

  const logoutHandler = () => {
    const accessToken = Cookies.get('ACCESS_KEY');
    console.log('✨ ‣ logoutHandler ‣ accessToken:', accessToken);
    Cookies.remove('ACCESS_KEY');
    console.log(Cookies);
    setLoggedin(false);
  };

  return (
    <div className="main-container w-full p-10">
      <div className="header w-full flex justify-between items-center mx-auto">
        <div
          className="logo m-2 relative z-10 flex justify-center items-center"
          onClick={handleHomePage}
          role="presentation"
        >
          <button type="button">
            <img
              src={cuppingLogo}
              className="w-[4rem] d1920:w-[14rem] d1440:w-[10rem] d1024:w-[6rem]"
              alt="커핑로고"
            />
          </button>
        </div>
        {loggined ? (
          <div className="function-bar flex items-center">
            <div className="profile-img">
              <img src={beniImg} alt="" className="w-[2rem] mr-2" />
            </div>
            <div className="mypage text-primary-color-orange font-bold relative z-10 mr-[3rem]">
              <button type="button">마이 페이지</button>
            </div>
            <button
              className="logout w-[2rem] relative z-10"
              onClick={logoutHandler}
              type="submit"
            >
              <img src={logout} className="cursor-pointer" alt="" />
            </button>
          </div>
        ) : (
          <div className="function-bar flex">
            <div
              className="signup text-primary-color-orange
          m-2 p-2 relative z-10 cursor-pointer"
              onClick={handleSignupPage}
              role="presentation"
            >
              회원가입
            </div>
            <div
              className="login bg-primary-color-orange
            m-2 px-4 py-2 rounded-lg relative z-10
            cursor-pointer text-white"
              onClick={handleLoginPage}
              role="presentation"
            >
              로그인
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
