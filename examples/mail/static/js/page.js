jQuery(document).ready(function() {
   jQuery.mReminder({
       icons: ["mail"],
       selectedIcon: "mail",
       reminderText: "Оставьте нам Вашу почту",
       formTitle: "Ваша почта",
       form: " <div class='m-reminder__form-close'>✖</div> " +
       "<h4 class='text-center m-reminder__form-title'>Ваша почта</h4>" +
       "  <div class='form-group row col-xs-12 m-reminder__form-group'>" +
       "    <input type='email' class='col-xs-12 m-reminder__form-input' placeholder='me@example.com' name='email'>" +
       "</div>" +
       "  <div class='form-group row col-xs-12 m-reminder__form-submit'>       " +
       "    <button class='form-control col-xs-12 m-reminder__form-input'>Отправить</button>" +
       "  </div>",
   });
});