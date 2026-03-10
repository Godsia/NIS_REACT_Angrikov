import React from 'react';
import { Link } from 'react-router-dom';
import {
  Autocomplete,
  TextField,
  Box,
  Button,
  Alert,
  Popover,
  IconButton,
  Typography,
  Paper,
} from '@mui/material';

import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
  isFuture,
} from 'date-fns';

import { ru } from 'date-fns/locale';

import { ITrainingTypes, trainingTypes } from '../../data/training';
import { trainingsApi } from '../../services/trainingsApi';

import './DataEntryPage.css';

const WEEKDAYS = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];

export const DataEntryPage: React.FC = () => {

  const [selectedValue,setSelectedValue] =
      React.useState<ITrainingTypes | null>(null);

  const [trainingDate,setTrainingDate] =
      React.useState<Date>(()=>new Date());

  const [calendarViewDate,setCalendarViewDate] =
      React.useState<Date>(()=>new Date());

  const [dateAnchor,setDateAnchor] =
      React.useState<HTMLElement | null>(null);

  const [kg,setKg] = React.useState('');
  const [reps,setReps] = React.useState('');
  const [kilometers,setKilometers] = React.useState('');
  const [timeMinutes,setTimeMinutes] = React.useState('');

  const [saving,setSaving] = React.useState(false);
  const [error,setError] = React.useState<string | null>(null);
  const [success,setSuccess] = React.useState(false);

  const resetForm = () => {
    setKg('');
    setReps('');
    setKilometers('');
    setTimeMinutes('');
    setTrainingDate(new Date());
    setCalendarViewDate(new Date());
  };

  React.useEffect(()=>{
    resetForm();
  },[selectedValue]);

  const getDateStr = () =>
      format(trainingDate,'yyyy-MM-dd');

  const handleSavePower = async () => {

    if(!selectedValue) return;

    const kgNum = parseFloat(kg);
    const repsNum = parseInt(reps,10);

    if(
        Number.isNaN(kgNum) ||
        Number.isNaN(repsNum) ||
        kgNum<=0 ||
        repsNum<=0
    ){
      setError('Введите вес и количество повторений');
      return;
    }

    setSaving(true);
    setError(null);

    try{

      await trainingsApi.create({
        date:getDateStr(),
        name:selectedValue.label,
        type:'POWER',
        weightKg:kgNum,
        quantity:repsNum
      });

      setSuccess(true);
      resetForm();

    }catch(e){
      setError(e instanceof Error ? e.message : 'Ошибка сохранения');
    }finally{
      setSaving(false);
    }
  };

  const handleSaveEndurance = async () => {

    if(!selectedValue) return;

    const kmNum = parseFloat(kilometers);
    const timeNum = parseInt(timeMinutes,10);

    if(
        Number.isNaN(kmNum) ||
        Number.isNaN(timeNum) ||
        kmNum<=0 ||
        timeNum<=0
    ){
      setError('Введите километраж и время');
      return;
    }

    setSaving(true);
    setError(null);

    try{

      await trainingsApi.create({
        date:getDateStr(),
        name:selectedValue.label,
        type:'ENDURANCE',
        distanceKm:kmNum,
        durationMinutes:timeNum
      });

      setSuccess(true);
      resetForm();

    }catch(e){
      setError(e instanceof Error ? e.message : 'Ошибка сохранения');
    }finally{
      setSaving(false);
    }
  };

  const isPower = selectedValue?.type === 'power';
  const isEndurance = selectedValue?.type === 'endurance';

  const calendarStart =
      startOfWeek(startOfMonth(calendarViewDate),{weekStartsOn:1});

  const calendarEnd =
      endOfWeek(endOfMonth(calendarViewDate),{weekStartsOn:1});

  const calendarDays =
      eachDayOfInterval({start:calendarStart,end:calendarEnd});

  const openDatePopover = (e:React.MouseEvent<HTMLElement>)=>{
    setCalendarViewDate(trainingDate);
    setDateAnchor(e.currentTarget);
  };

  const closeDatePopover = ()=>setDateAnchor(null);

  const handleSelectDate = (d:Date)=>{
    setTrainingDate(d);
    closeDatePopover();
  };

  return (

      <div className="data-entry">

        <div className="data-entry-container">

          <header className="data-entry-header">

            <div>
              <h1 className="data-entry-title">
                Ввод тренировки
              </h1>

              <p className="data-entry-subtitle">
                Добавление данных о тренировке
              </p>
            </div>

            <Link to="/">
              <Button variant="outlined">
                ← На главную
              </Button>
            </Link>

          </header>

          {error &&
              <Alert severity="error" sx={{mb:2}}>
                {error}
              </Alert>
          }

          {success &&
              <Alert severity="success" sx={{mb:2}}>
                Тренировка сохранена
              </Alert>
          }

          <Paper className="data-entry-card">

            <Box className="data-entry-fields">

              <Autocomplete<ITrainingTypes>
                  options={trainingTypes}
                  value={selectedValue}
                  onChange={(_,v)=>setSelectedValue(v)}
                  renderInput={(params)=>
                      <TextField {...params} label="Тип тренировки"/>
                  }
              />

              <TextField
                  label="Дата"
                  value={format(trainingDate,'d MMMM yyyy',{locale:ru})}
                  onClick={openDatePopover}
                  inputProps={{readOnly:true}}
              />

            </Box>

            <Popover
                open={Boolean(dateAnchor)}
                anchorEl={dateAnchor}
                onClose={closeDatePopover}
                anchorOrigin={{vertical:'bottom',horizontal:'left'}}
            >

              <Box className="calendar">

                <Box className="calendar-header">

                  <IconButton
                      size="small"
                      onClick={()=>setCalendarViewDate(d=>subMonths(d,1))}
                  >
                    ‹
                  </IconButton>

                  <Typography>
                    {format(calendarViewDate,'LLLL yyyy',{locale:ru})}
                  </Typography>

                  <IconButton
                      size="small"
                      onClick={()=>setCalendarViewDate(d=>addMonths(d,1))}
                  >
                    ›
                  </IconButton>

                </Box>

                <Box className="calendar-grid">

                  {WEEKDAYS.map(d=>
                      <Typography
                          key={d}
                          variant="caption"
                          className="calendar-weekday"
                      >
                        {d}
                      </Typography>
                  )}

                  {calendarDays.map(day=>{

                    const inMonth=isSameMonth(day,calendarViewDate);
                    const selected=isSameDay(day,trainingDate);
                    const disabled=isFuture(day);

                    return(

                        <Button
                            key={day.getTime()}
                            size="small"
                            disabled={disabled}
                            onClick={()=>!disabled && handleSelectDate(day)}
                            className={`calendar-day
${selected?'selected':''}
${!inMonth?'muted':''}`}
                        >

                          {format(day,'d')}

                        </Button>

                    );

                  })}

                </Box>

              </Box>

            </Popover>

            {isPower && (

                <Box className="data-entry-form">

                  <TextField
                      label="Вес (кг)"
                      type="number"
                      value={kg}
                      onChange={(e)=>setKg(e.target.value)}
                  />

                  <TextField
                      label="Повторения"
                      type="number"
                      value={reps}
                      onChange={(e)=>setReps(e.target.value)}
                  />

                  <Button
                      variant="contained"
                      onClick={handleSavePower}
                      disabled={saving}
                  >

                    {saving?'Сохранение...':'Сохранить'}

                  </Button>

                </Box>

            )}

            {isEndurance && (

                <Box className="data-entry-form">

                  <TextField
                      label="Километры"
                      type="number"
                      value={kilometers}
                      onChange={(e)=>setKilometers(e.target.value)}
                  />

                  <TextField
                      label="Время (мин)"
                      type="number"
                      value={timeMinutes}
                      onChange={(e)=>setTimeMinutes(e.target.value)}
                  />

                  <Button
                      variant="contained"
                      onClick={handleSaveEndurance}
                      disabled={saving}
                  >

                    {saving?'Сохранение...':'Сохранить'}

                  </Button>

                </Box>

            )}

          </Paper>

        </div>

      </div>

  );
};