-- phpMyAdmin SQL Dump
-- version 4.1.4
-- http://www.phpmyadmin.net
--
-- Client :  127.0.0.1
-- Généré le :  Jeu 05 Mars 2015 à 14:40
-- Version du serveur :  5.6.15-log
-- Version de PHP :  5.5.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de données :  `monopoly`
--

-- --------------------------------------------------------

--
-- Structure de la table `cartes`
--

CREATE TABLE IF NOT EXISTS `cartes` (
  `idCarte` int(11) NOT NULL AUTO_INCREMENT,
  `NomCarte` varchar(20) NOT NULL,
  `Contenu` text NOT NULL,
  `Garder` tinyint(1) NOT NULL,
  PRIMARY KEY (`idCarte`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=22 ;

--
-- Contenu de la table `cartes`
--

INSERT INTO `cartes` (`idCarte`, `NomCarte`, `Contenu`, `Garder`) VALUES
(1, 'Pas Chance', 'Kim Jung pirate votre banque, vous perdez 1’000’000', 0),
(2, 'Pas Chance', 'CableCom prend en charge votre accès à Internet : plus de connexion pendant 2 tours (c’est cadeau)\n', 0),
(3, 'Pas Chance', 'Un attentat a lieu dans une de vos capitales, vous donnez 200’000 aux taxes pour les réparations', 0),
(4, 'Pas Chance', 'Les étrangers sont stigmatisés, ils se revoltent, acheter leur loyauté (100’000 par pays)\n', 0),
(5, 'Pas Chance', 'Une centrale nucléaire a des fuites d’Uranium 239, vous n’avez plus d’eau pendant 2 tours', 0),
(6, 'Pas Chance', 'La NSA restreint l’accès aux sites pornographiques dans vos pays Américains et vous perdez 500’000 de recettes sur les VOD', 0),
(7, 'Pas Chance', 'Vous avez été pris en flagrant délit de viol sur mineure, tout ça sur votre lieu de travail, vous allez en prison et vous dédommagez son père (votre voisin de gauche) de 2’000’000', 0),
(8, 'Pas Chance', 'Le roi Burgonde installe ses troupes dans votre premier pays d’Asie, en gros crados ils polluent votre eau. Elle est imbuvable pendant 2 tours\r\n', 0),
(9, 'Pas Chance', 'Les États-Unis viennent libérer un de vos pays au moyen-orient, toutes les améliorations sont saisies par les américains au nom de la démocratie', 0),
(10, 'Pas Chance', 'Il y a une éruption solaire, plus personne n’a d’électricité pendant 1 tour; l’Europe, 2 tours', 0),
(11, 'Chance', 'Arthur Pendragon a retiré Excalibur du rocher, la Grande-Bretagne gagne en notoriété. Vous offrez en cadeau 500’000 au nouveau roi en signe de loyauté', 0),
(12, 'Chance', 'La police ne remarque pas votre labo de meth, vous boostez vos vente et vous touchez 1’000’000', 0),
(13, 'Chance', 'Les extraterrestres apportent une technologie qu’ils appellent internet, vous pouvez la mettre dans le pays de votre choix\r\n', 1),
(14, 'Chance', 'Le gouvernement organise une opération sous faux drapeau dans un de vos pays, le peuple est outré contre une minorité, vous êtes autorisés à envahir un pays de qualité inférieure si vous payez 10’000’000 de taxes (pot-de-vin à l’UE)\r\n', 1),
(15, 'Chance', 'Vous devenez ami avec le procureur général qui vous immunise de la prison. Cette carte est utilisable indéfiniment.\r\n', 1),
(16, 'Chance', 'Vous découvrez un puits de pétrole sous votre territoire, la vente de ce dernier vous rapporte en tout 2’000’000', 0),
(17, 'Chance', 'Vous repondez la réponse D à “ Qui Veut Gagner De L’argent En Masse”, vous gagnez 1’000’000, félicitations', 0),
(18, 'Chance', 'Vous n’avez pas le temps, vous êtes une personne trop overbookée ? Rejouez', 0),
(19, 'Chance', 'Vous perdez en crédibilité auprès du peuple. Vous dépensez 500’000 en campagne publicitaire mais vous en récupérez 200’000 par tour pendant 5 tours.', 0),
(20, 'Chance', 'Un EMS prend feu pendant que les pompiers regardaient la Coupe du Monde, vous économisez 300’000 de fonds', 0),
(21, 'Chance', '“ Il est d’accord ! “, vous héritez du pays sur lequel le Roi Burgonde est placé\r\n', 0);

-- --------------------------------------------------------

--
-- Structure de la table `joueurs`
--

CREATE TABLE IF NOT EXISTS `joueurs` (
  `idJoueur` int(11) NOT NULL AUTO_INCREMENT,
  `pseudo` varchar(20) NOT NULL,
  `mdp` varchar(30) NOT NULL COMMENT 'Super2008 pour tous',
  `position` int(11) DEFAULT NULL,
  `etat` varchar(20) NOT NULL,
  `solde` int(11) NOT NULL,
  PRIMARY KEY (`idJoueur`),
  UNIQUE KEY `pseudo` (`pseudo`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=6 ;

--
-- Contenu de la table `joueurs`
--

INSERT INTO `joueurs` (`idJoueur`, `pseudo`, `mdp`, `position`, `etat`, `solde`) VALUES
(1, 'Ana', '0fddc5fc3b323288bb908ad27937c2', 0, '0', 100000000),
(2, 'Pannufle', '0fddc5fc3b323288bb908ad27937c2', 0, '0', 201500),
(3, 'Monstross', '0fddc5fc3b323288bb908ad27937c2', 0, '0', 100000000),
(4, 'MalComX', '0fddc5fc3b323288bb908ad27937c2', 0, '0', 100000000),
(5, 'DomKiki', '0fddc5fc3b323288bb908ad27937c2', 0, '0', 100000000);

-- --------------------------------------------------------

--
-- Structure de la table `participe`
--

CREATE TABLE IF NOT EXISTS `participe` (
  `idJoueur` int(11) NOT NULL,
  `idPartie` int(11) NOT NULL,
  PRIMARY KEY (`idJoueur`,`idPartie`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Contenu de la table `participe`
--

INSERT INTO `participe` (`idJoueur`, `idPartie`) VALUES
(1, 1),
(2, 1),
(3, 1),
(4, 1);

-- --------------------------------------------------------

--
-- Structure de la table `parties`
--

CREATE TABLE IF NOT EXISTS `parties` (
  `idPartie` int(11) NOT NULL AUTO_INCREMENT,
  `nbJoueurs` int(11) NOT NULL,
  `idJoueur` int(11) NOT NULL COMMENT 'Créateur de la partie',
  PRIMARY KEY (`idPartie`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Contenu de la table `parties`
--

INSERT INTO `parties` (`idPartie`, `nbJoueurs`, `idJoueur`) VALUES
(1, 4, 1);

-- --------------------------------------------------------

--
-- Structure de la table `pays`
--

CREATE TABLE IF NOT EXISTS `pays` (
  `idPays` int(11) NOT NULL AUTO_INCREMENT,
  `NomPays` varchar(20) NOT NULL,
  `Prix` double NOT NULL,
  `Position` int(11) DEFAULT NULL,
  `Continent` varchar(20) NOT NULL,
  PRIMARY KEY (`idPays`),
  UNIQUE KEY `NomPays` (`NomPays`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=25 ;

--
-- Contenu de la table `pays`
--

INSERT INTO `pays` (`idPays`, `NomPays`, `Prix`, `Position`, `Continent`) VALUES
(1, 'Somalie', 1.2, 1, 'Afrique'),
(2, 'Congo', 1.4, 2, 'Afrique'),
(3, 'Tunisie', 2, 4, 'Afrique'),
(4, 'Maroc', 2, 5, 'Afrique'),
(5, 'Afrique du sud', 2.4, 7, 'Afrique'),
(6, 'Seychelles', 2.4, 8, 'Afrique'),
(7, 'Corée du nord', 2.8, 10, 'Asie'),
(8, 'Afghanistan', 3, 11, 'Asie'),
(9, 'Russie', 3.2, 13, 'Asie'),
(10, 'Japon', 3.8, 14, 'Asie'),
(11, 'Chine', 4.4, 16, 'Asie'),
(12, 'Qatar', 4.8, 17, 'Asie'),
(13, 'Colombie', 5, 19, 'Amérique'),
(14, 'Chili', 5.2, 20, 'Amérique'),
(15, 'Mexique', 5.8, 22, 'Amérique'),
(16, 'USA', 6.2, 23, 'Amérique'),
(17, 'Canada', 6.8, 25, 'Amérique'),
(18, 'Iles Cayman', 7, 26, 'Amérique'),
(19, 'Grèce', 7.4, 28, 'Europe'),
(20, 'France', 8, 29, 'Europe'),
(21, 'Espagne', 8.4, 31, 'Europe'),
(22, 'Allemagne', 9, 32, 'Europe'),
(23, 'Luxembourg', 9.8, 34, 'Europe'),
(24, 'Suisse', 10, 35, 'Europe');

-- --------------------------------------------------------

--
-- Structure de la table `possedecarte`
--

CREATE TABLE IF NOT EXISTS `possedecarte` (
  `idCarte` int(11) NOT NULL,
  `idJoueur` int(11) NOT NULL,
  `idPartie` int(11) NOT NULL,
  PRIMARY KEY (`idCarte`,`idJoueur`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `possedepays`
--

CREATE TABLE IF NOT EXISTS `possedepays` (
  `idJoueur` int(11) NOT NULL,
  `idPays` int(11) NOT NULL,
  `etatHypotheque` tinyint(1) NOT NULL,
  `etatAmelioration` int(11) NOT NULL,
  `idPartie` int(11) NOT NULL,
  PRIMARY KEY (`idJoueur`,`idPays`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
