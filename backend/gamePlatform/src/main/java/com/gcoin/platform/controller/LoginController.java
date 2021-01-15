package com.gcoin.platform.controller;


import com.gcoin.platform.dataobject.AccountDO;
import com.gcoin.platform.response.Response;
import com.gcoin.platform.service.AccountService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

@RestController
@RequestMapping("login")
@CrossOrigin(origins = {"*"})
@Log4j2

public class LoginController {

    @Autowired
    private AccountService accountService;

    @Autowired
    private HttpServletRequest httpServletRequest;

    @RequestMapping("/verifylogin")
    public Response verifyLogin(){
        log.info(this.httpServletRequest.getSession().getId());
        Boolean isLogin = (Boolean) this.httpServletRequest.getSession().getAttribute("IS_LOGIN");
        if (isLogin == null){
            return new Response(Response.RELOGIN, "Require to login", null);
        }else{
            return new Response(Response.SUCCESS,"User is verified",null);
        }
    }

    @RequestMapping("/userlogin")
    public Response login( @RequestParam String username,
                           @RequestParam String password ) {

        log.info("user login: "+username);
        AccountDO account = accountService.login(username, password);
        if(account == null){
            return new Response(Response.FAIL,
                    "Invalid Account / Password",null);
        }else {
            HttpSession httpSession = this.httpServletRequest.getSession();
            httpSession.setMaxInactiveInterval(10*60);
            log.info(httpSession.getId());
            this.httpServletRequest.getSession().setAttribute("IS_LOGIN", true);
            return new Response(account);
        }
    }

    @RequestMapping("/registration")
    public void registry(@RequestParam String username,
                         @RequestParam String password) throws Exception {
        accountService.registrate(username, password);
    }
}
