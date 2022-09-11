import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '../button/Button';
import { useSpeechSynthesis } from 'react-speech-kit';
import TextToSpeech from '../textToSpeech/TextToSpeech';

import './Notes.css';

const Notes = ({ columns, setColumns }) => {
  const location = useLocation();
  const { item } = location.state;
  const [dataToRender, setDataToRender] = useState(item);
  const [stringToTranslate, setStringToTranslate] = useState({ english: '' });
  const [translatedString, setTranslatedString] = useState({ polish: '' });
  const [transEngPlPlEnd, setTransEngPlPlEnd] = useState('');
  const { voices } = useSpeechSynthesis();

  const axios = require('axios');

  useEffect(() => {
    axios
      .get(`http://localhost:8000/position`)
      .then(function (response) {
        setColumns(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  const handleChangeTextField = (event) => {
    const { name, value } = event.target;

    setDataToRender({
      ...dataToRender,
      [name]: value,
    });
  };

  const postToDb = () => {
    axios
      .post(`http://localhost:8000/position`, columns)
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (columns.columnFour?.items) {
      const itemsArray = columns.columnFour.items;

      itemsArray.forEach((el, index) => {
        if (el.id === item.id) itemsArray[index] = dataToRender;
      });

      postToDb();
    }

    setStringToTranslate({ english: '' });
    setTranslatedString({ polish: '' });
  };

  const handleTranslation = (event) => {
    event.preventDefault();

    if (stringToTranslate.english) {
      const options = {
        method: 'POST',
        url: 'https://deep-translate1.p.rapidapi.com/language/translate/v2',
        headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Key': process.env.REACT_APP_X_RapidAPI_Key,
          'X-RapidAPI-Host': process.env.REACT_APP_X_RapidAPI_Host,
        },

        data: `{"q":"${stringToTranslate.english}",${transEngPlPlEnd}}`,
      };

      axios
        .request(options)
        .then(function (response) {
          console.log(response.data.data.translations.translatedText);
          setTranslatedString({
            polish: response.data.data.translations.translatedText,
          });
        })
        .catch(function (error) {
          console.error(error);
        });
    }
  };

  const handleChangeTranslationField = (event) => {
    const { name, value } = event.target;
    setStringToTranslate({ ...stringToTranslate, [name]: value });
  };

  const handleTranslationLanguage = (event) => {
    const { value } = event.target;
    setTransEngPlPlEnd(value);
  };

  return (
    <>
      <div className='notes-wrapper'>
        <div className='table-wrapper-present'>
          <table>
            <tbody>
              <tr>
                <td>{dataToRender.word_image.english_word}</td>
                <td>{dataToRender.present.present_ja}</td>
                <td>{dataToRender.present.present_ty}</td>
                <td>{dataToRender.present.present_on_ona_ono}</td>
                <td>{dataToRender.present.present_my}</td>
                <td>{dataToRender.present.present_wy}</td>
                <td>{dataToRender.present.present_oni_one}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className='card-image'>
          {dataToRender.word_image.image_url && (
            <img
              src={dataToRender.word_image.image_url}
              alt='img'
              height='150'
              width='200'
            />
          )}
        </div>
        <div className='table-wrapper-past'>
          <table>
            <tbody>
              <tr>
                <td className='masculine'>{dataToRender.past.past_ja_masc}</td>
                <td className='masculine-alt'>
                  {dataToRender.past.past_ty_masc}
                </td>
                <td className='masculine'>{dataToRender.past.past_on_masc}</td>
                <td className='masculine-alt'>
                  {dataToRender.past.past_my_masc}
                </td>
                <td className='masculine'>{dataToRender.past.past_wy_masc}</td>
                <td className='masculine-alt'>
                  {dataToRender.past.past_oni_masc}
                </td>
              </tr>
              <tr>
                <td className='feminine'>{dataToRender.past.past_ja_fem}</td>
                <td className='feminine-alt'>
                  {dataToRender.past.past_ty_fem}
                </td>
                <td className='feminine'>{dataToRender.past.past_ona_fem}</td>
                <td className='feminine'>{dataToRender.past.past_my_fem}</td>
                <td className='feminine-alt'>
                  {dataToRender.past.past_wy_fem}
                </td>
                <td className='feminine'>{dataToRender.past.past_one_fem}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className='table-wrapper-future'>
          <table>
            <tbody>
              <tr>
                <td>{dataToRender.imp_future.imp_future_ja}</td>
                <td>{dataToRender.imp_future.imp_future_ty}</td>
                <td>{dataToRender.imp_future.imp_future_on_ona_ono}</td>
                <td>{dataToRender.imp_future.imp_future_my}</td>
                <td>{dataToRender.imp_future.imp_future_wy}</td>
                <td>{dataToRender.imp_future.imp_future_oni_one}</td>
              </tr>
              <tr>
                <td className='masculine'>
                  {dataToRender.future_masc.future_masc_ja}
                </td>
                <td className='masculine-alt'>
                  {dataToRender.future_masc.future_masc_ty}
                </td>
                <td className='masculine'>
                  {dataToRender.future_masc.future_masc_on}
                </td>
                <td className='masculine-alt'>
                  {dataToRender.future_masc.future_masc_my}
                </td>
                <td className='masculine'>
                  {dataToRender.future_masc.future_masc_wy}
                </td>
                <td className='masculine-alt'>
                  {dataToRender.future_masc.future_masc_oni}
                </td>
              </tr>
              <tr>
                <td className='feminine'>
                  {dataToRender.future_fem.future_fem_ja}
                </td>

                <td className='feminine-alt'>
                  {dataToRender.future_fem.future_fem_ty}
                </td>
                <td className='feminine'>
                  {dataToRender.future_fem.future_fem_ona}
                </td>

                <td className='feminine-alt'>
                  {dataToRender.future_fem.future_fem_my}
                </td>

                <td className='feminine'>
                  {dataToRender.future_fem.future_fem_wy}
                </td>

                <td className='feminine-alt'>
                  {dataToRender.future_fem.future_fem_one}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className='user-notes-input'>
        <form>
          <div className='translation'>
            <div className='translation-btn-link'>
              <Button
                buttonStyle='btn--translation'
                buttonSize='btn--medium'
                onClick={handleTranslation}
              >
                Translate
              </Button>
              <a
                href='https://cooljugator.com/pl'
                target='_blank'
                rel='noreferrer'
              >
                Koniugacja
              </a>
            </div>
            <div className='text-to-translate'>
              <textarea
                onChange={handleChangeTranslationField}
                placeholder='Tekst do przetłumaczenia'
                name='english'
                value={stringToTranslate.english}
              ></textarea>
            </div>

            <div className='translation-radio-buttons'>
              <div>
                <input
                  className='radio-buttons-pl-eng'
                  type='radio'
                  id='pl-eng'
                  name='translation'
                  value={'"source":"pl","target":"en"'}
                  // checked={}
                  onChange={handleTranslationLanguage}
                />
                <label htmlFor='pl-eng'>pl-eng</label>
              </div>
              <div>
                <input
                  className='radio-buttons-eng-pl'
                  type='radio'
                  id='eng-pl'
                  name='translation'
                  value={'"source":"en","target":"pl"'}
                  // checked={ }
                  onChange={handleTranslationLanguage}
                />
                <label htmlFor='eng-pl'>eng-pl</label>
              </div>
            </div>

            <div className='translated-text'>
              <textarea
                placeholder='Przetłumaczony tekst'
                defaultValue={translatedString.polish}
              ></textarea>
            </div>
          </div>

          <textarea
            className='user-notes'
            id='notes'
            name='notes'
            rows='4'
            cols='25'
            value={dataToRender.notes}
            onChange={handleChangeTextField}
          >
            {dataToRender.notes}
          </textarea>
          <div className='update-notes-play-voice'>
            <Button
              className='btn--update-notes'
              buttonStyle='btn--add-new-verb'
              buttonSize='btn--medium'
              id='submit-verb-button'
              type='submit'
              onClick={handleSubmit}
            >
              Update notes
            </Button>
            <div className='text-to-speech'>
              <TextToSpeech data={dataToRender.notes} voices={voices} />
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Notes;
