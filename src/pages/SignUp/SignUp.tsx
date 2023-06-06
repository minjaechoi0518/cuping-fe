import { useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import { useEffect, useState } from 'react';
import useInput from '../../hooks/useInput';
import { userSignup, checkUserId } from '../../apis/api/signup';
import OwnerSignUpForm from './OwnerSignUpForm';
import useToggle from '../../hooks/useToggle';
import errorIcon from '../../assets/warning.svg';
import Post from '../../components/Modal/Post';

function SignUp() {
  const navigate = useNavigate();
  const [userId, idRef, handleChangeUserId] = useInput();
  const [nickname, nicknameRef, handleChangeNickname] = useInput();
  const [password, PasswordRef, handleChangePassword] = useInput();
  const [passwordCheck, PasswordCheckRef, handleChangePasswordCheck] =
    useInput();
  const [userIdError, setUserIdError] = useState('');
  const [passwordCheckError, setPasswordCheckError] = useState('');
  const [isIdUnique, setIsIdUnique] = useToggle();

  const signup = useMutation(userSignup, {
    onSuccess: (response: any) => {
      alert('회원가입이 완료되었습니다!');
      navigate('/');
      console.log(response);
    },
    onError: (error: unknown) => {
      alert(`${(error as Error).response.data.message}`);
    },
  });

  const checkId = useMutation(checkUserId, {
    onSuccess: (response: any) => {
      if (response === '사용중인 아이디입니다.') {
        alert(response);
      }
      if (response === '사용 가능한 아이디입니다.') {
        setIsIdUnique(isIdUnique => true);
      }
    },
    onError: error => {
      console.log('실패', error);
    },
  });

  // 아이디 유효 검사
  useEffect(() => {
    if (userId && !isIdUnique) {
      return setUserIdError('아이디 중복을 확인하세요.');
    }
    if (userId && isIdUnique) {
      return setUserIdError('사용 가능한 아이디입니다.');
    }
  }, [userId, isIdUnique]);

  // 아이디 중복 검사 버튼 클릭
  const idCheckBtnClick = () => {
    checkId.mutate({ userId });
  };

  // 비밀번호 일치 검사
  useEffect(() => {
    if (!!passwordCheck && passwordCheck !== password) {
      setPasswordCheckError('비밀번호가 일치하지 않습니다.');
    } else {
      setPasswordCheckError(null);
    }
  }, [password, passwordCheck]);

  // 회원가입 버튼 클릭, 유효성 검사
  const signupBtnClick = (e: any) => {
    e.preventDefault();
    const usernameRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d_]{5,12}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!?_]{8,12}$/;

    if (!nickname || !password || !userId) {
      alert('아이디,닉네임과 비밀번호를 모두 입력하세요.');
    } else if (!usernameRegex.test(nickname)) {
      alert('닉네임은 최소 5~12자, 알파벳 소문자 및 숫자로 구성되어야 합니다.');
    } else if (!passwordRegex.test(password)) {
      alert(
        '비밀번호는 최소 8~12자, 알파벳 대소문자 및 숫자로 구성되어야 합니다.',
      );
    } else if (password !== passwordCheck) {
      alert('비밀번호가 일치하지 않습니다.');
    } else {
      signup.mutate({
        userId,
        nickname,
        password,
      });
    }
  };

  // 일반/사장 가입 스위칭
  const [active, setActive] = useState(false);

  const handleButtonClick = (isOwnerForm: any) => {
    if ((isOwnerForm && !active) || (!isOwnerForm && active)) {
      setActive(!active);
    }
  };

  return (
    <div className="min-h-screen bg-secondary-color-light sm:py-12 w-full">
      <div className="p-10 xs:p-0 mx-auto md:w-full w-full flex justify-center">
        {/* <h1 className="font-bold text-center text-2xl mb-5">Cupping</h1> */}
        <div className="bg-white divide-y divide-gray-200 border-4 border-primary-color-salgu w-[28rem]">
          <div className="m-9">
            <div className="p-3">
              <div className="grid grid-cols-2 gap-1 bg-gray-200 rounded-lg px-0.5 py-1">
                <button
                  type="button"
                  onClick={() => handleButtonClick(false)}
                  className={`transition duration-200 border bg-gray-200 border-gray-200 text-gray-500 w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md 
                  ${
                    !active ? 'bg-white text-orange-400 font-semibold' : ''
                  } font-normal text-center inline-block`}
                >
                  일반 회원 등록
                </button>
                <button
                  type="button"
                  onClick={() => handleButtonClick(true)}
                  className={`transition duration-200 border bg-gray-200 border-gray-200 text-gray-500 w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md
                  ${
                    active ? 'bg-white text-orange-400 font-semibold' : ''
                  } font-normal text-center inline-block`}
                >
                  사장님 회원 등록
                </button>
              </div>
            </div>

            {active ? (
              <OwnerSignUpForm
                userId={userId}
                handleChangeUserId={handleChangeUserId}
                nickname={nickname}
                handleChangeNickname={handleChangeNickname}
                password={password}
                handleChangePassword={handleChangePassword}
                passwordCheck={passwordCheck}
                handleChangePasswordCheck={handleChangePasswordCheck}
                passwordCheckError={passwordCheckError}
              />
            ) : (
              <>
                <label
                  htmlFor="idInput"
                  className="text-sm text-gray-600 pb-1 block"
                >
                  <div className="font-semibold mb-1">아이디</div>
                  <div className="flex items-center gap-2">
                    <input
                      value={userId}
                      onChange={handleChangeUserId}
                      ref={idRef}
                      id="idInput"
                      type="text"
                      placeholder="아이디 입력(5~12자)"
                      className="border rounded-lg px-3 py-2 mt-1 mb-1 text-sm w-full"
                    />
                    <button
                      type="button"
                      onClick={idCheckBtnClick}
                      className="transition duration-200 bg-primary-color-salgu hover:bg-primary-color-orange text-white w-[10rem] py-2 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
                    >
                      <span className="inline-block">중복확인</span>
                    </button>
                  </div>
                </label>
                <label
                  htmlFor="nkInput"
                  className="text-sm text-gray-600 pb-1 block"
                >
                  <div className="font-semibold mb-1">닉네임</div>
                  <input
                    value={nickname}
                    onChange={handleChangeNickname}
                    ref={nicknameRef}
                    id="nkInput"
                    type="text"
                    placeholder="닉네임을 입력하세요."
                    className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                  />
                </label>

                <label
                  htmlFor="pwInput"
                  className="text-sm text-gray-600 pb-1 block"
                >
                  <div className="font-semibold mb-1">비밀번호</div>
                  <input
                    value={password}
                    onChange={handleChangePassword}
                    ref={PasswordRef}
                    id="pwInput"
                    type="password"
                    placeholder="비밀번호 입력(영문,숫자 조합 최소8자)"
                    className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                  />
                </label>
                <div className="relative flex flex-col">
                  <label
                    htmlFor="pwCheckInput"
                    className="text-sm text-gray-600 pb-1 block"
                  >
                    <div>
                      <div className="font-semibold mb-1">비밀번호 확인</div>
                      <input
                        value={passwordCheck}
                        onChange={handleChangePasswordCheck}
                        ref={PasswordCheckRef}
                        id="pwCheckInput"
                        type="password"
                        placeholder="비밀번호를 다시 입력하세요."
                        className={`${
                          passwordCheckError
                            ? 'ring-red-500 ring-1 border rounded-lg px-3 py-2 mt-1 mb-2 text-sm w-full'
                            : 'border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full'
                        }`}
                      />
                    </div>
                  </label>
                  {passwordCheckError && (
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-red-500 flex items-center">
                        {passwordCheckError}
                      </p>
                      <img
                        src={errorIcon}
                        className="w-[18px] flex items-center"
                        alt=""
                      />
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  onClick={signupBtnClick}
                  className="transition duration-200 bg-primary-color-salgu hover:bg-primary-color-orange text-white w-full py-2.5 mt-2 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
                >
                  <span className="inline-block mr-2">회원가입 하기</span>
                </button>
                <div className="border-t border-gray-200 my-5 mt-10" />
                <button
                  type="button"
                  className="transition duration-200 bg-yellow-400 hover:bg-yellow-600 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
                >
                  카카오톡 간편 가입하기
                </button>
                <div className="mt-10 text-center">
                  <span className="font-semibold text-sm">
                    이미 커핑 회원이세요?
                  </span>
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="font-semibold text-sm ml-2 text-primary-color-orange  tracking-tighter"
                  >
                    로그인 하러 가기
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
